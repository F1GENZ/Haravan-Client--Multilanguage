import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from "react-router";
import { useLocation } from "react-router-dom";
import { Button, Tabs, Flex, Spin, Space, message, Modal } from 'antd';
import { TranslationOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { metafieldsService } from '../../common/MetafieldsServices';
import { dataService } from '../../common/DataServices';
import { translateText, translateHTML } from '../../common/TranslateService';
import { useLanguages } from '../../common/LanguageService';
import { useConfigSettings } from '../../common/ConfigService';
import TabMetafields from './tab';


const Metafields = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  // Extract type from pathname: /translator/products -> product, /translator/collections -> collection
  const pathParts = location.pathname.split('/');
  const rawType = pathParts[pathParts.length - 1] || 'products'; // Default to products
  
  // Convert plural to singular for API (products -> product, collections -> collection)
  const type = rawType.endsWith('s') ? rawType.slice(0, -1) : rawType;
  
  const objectid = searchParams.get("id") || "0";

  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState('0');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Load languages from Shop Metafield API using custom hook
  const { languages, isLoading: languagesLoading } = useLanguages();
  
  // Load custom fields from Shop Metafield API
  const { productFields, collectionFields, isLoading: configLoading } = useConfigSettings();
  
  const customFields = type === 'product' ? productFields : collectionFields;
  
  // Create refs dynamically based on languages
  const tabRefs = useRef({});
  languages.forEach((_, index) => {
    if (!tabRefs.current[index]) {
      tabRefs.current[index] = React.createRef();
    }
  });

  // Get namespace for current active tab
  const getCurrentNamespace = () => {
    const tabIndex = parseInt(activeTab) || 0;
    const currentLanguage = languages[tabIndex];
    if (!currentLanguage) return 'hrvmultilang_vi'; // fallback
    return `hrvmultilang_${currentLanguage.code}`;
  };

  const currentNamespace = getCurrentNamespace();
  const { isLoading: field_loading, data: field_data } = metafieldsService.useGetMetafields({ 
    type, 
    namespace: currentNamespace, 
    objectid 
  });
  const deleteMetafieldMutation = metafieldsService.useDeleteField();
  const createMetafieldMutation = metafieldsService.useCreateField();
  const updateMetafieldMutation = metafieldsService.useUpdateField();

  // Fetch product data if type is 'product' and we have a valid ID
  const { data: product_data, isLoading: product_loading } = dataService.useGetProduct(
    type === 'product' && objectid !== '0' ? objectid : null
  );

  // Check if current tab has changes
  useEffect(() => {
    const checkChanges = () => {
      const tabIndex = parseInt(activeTab);
      const currentRef = tabRefs.current[tabIndex];
      if (currentRef && currentRef.isDirty !== undefined) {
        setHasChanges(currentRef.isDirty);
      }
    };
    
    // Check immediately and set up interval to check periodically
    checkChanges();
    const interval = setInterval(checkChanges, 100); // Check every 100ms
    
    return () => clearInterval(interval);
  }, [activeTab]);

  // Handle tab change with unsaved changes warning
  const handleTabChange = (newTabKey) => {
    const currentTabIndex = parseInt(activeTab);
    const currentRef = tabRefs.current[currentTabIndex];
    
    // Check if current tab has unsaved changes
    if (currentRef && currentRef.isDirty) {
      Modal.confirm({
        title: 'Cảnh báo: Có thay đổi chưa lưu!',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn chuyển tab? Các thay đổi sẽ bị mất.',
        okText: 'Chuyển tab',
        cancelText: 'Ở lại',
        okType: 'danger',
        onOk: () => {
          setActiveTab(newTabKey);
        },
      });
    } else {
      // No changes, switch tab directly
      setActiveTab(newTabKey);
    }
  };

  // Auto translate function
  const handleAutoTranslate = async () => {
    const tabIndex = parseInt(activeTab);
    const currentRef = tabRefs.current[tabIndex];
    
    if (!currentRef) {
      message.error('Không tìm thấy form!');
      return;
    }

    // Kiểm tra OpenAI API key
    const openaiSettings = localStorage.getItem('openai_settings');
    let apiKey = '';
    
    if (openaiSettings) {
      try {
        const settings = JSON.parse(openaiSettings);
        apiKey = settings.apiKey || '';
      } catch (e) {
        // Invalid JSON, treat as empty
      }
    }
    
    if (!apiKey || apiKey.trim() === '') {
      message.error({
        content: 'Chưa cấu hình OpenAI API Key! Vui lòng vào Settings → API Configuration để nhập API Key.',
        duration: 5,
      });
      return;
    }

    if (languages.length === 0) {
      message.error('Chưa có ngôn ngữ nào được cấu hình!');
      return;
    }

    if (customFields.length === 0) {
      message.error('Chưa có trường tùy chỉnh nào!');
      return;
    }

    setIsTranslating(true);
    try {
      // Lấy ngôn ngữ từ tab đang active
      const targetLanguage = languages[tabIndex];
      
      if (!targetLanguage) {
        message.error('Ngôn ngữ không hợp lệ!');
        setIsTranslating(false);
        return;
      }
      
      // Lấy giá trị từ form nguồn (bên trái)
      const sourceValues = currentRef.getSourceValues();
      
      // Check if there's any content to translate
      const hasContent = customFields.some(field => sourceValues[field.key]);
      if (!hasContent) {
        message.warning('Không có nội dung để dịch!');
        setIsTranslating(false);
        return;
      }

      message.loading(`Đang dịch sang ${targetLanguage.name}...`, 0);
      
      // Dịch tất cả các fields
      const translatedValues = {};
      
      for (const field of customFields) {
        const sourceText = sourceValues[field.key];
        
        if (sourceText && sourceText.trim()) {
          if (field.fieldType === 'string') {
            translatedValues[field.key] = await translateText(sourceText, { 
              targetLanguage: targetLanguage.code 
            });
          } else if (field.fieldType === 'html') {
            translatedValues[field.key] = await translateHTML(sourceText, { 
              targetLanguage: targetLanguage.code 
            });
          }
        } else {
          translatedValues[field.key] = '';
        }
      }
      
      // Điền vào form bên phải
      currentRef.setTranslatedValues(translatedValues);
      
      message.destroy();
      message.success(`Dịch sang ${targetLanguage.name} thành công!`);
      setIsTranslating(false);
    } catch (error) {
      message.destroy();
      setIsTranslating(false);
      
      // Kiểm tra loại lỗi để hiển thị thông báo cụ thể hơn
      let errorMessage = 'Lỗi khi dịch tự động!';
      
      if (error.message && error.message.includes('API key')) {
        errorMessage = 'OpenAI API Key không hợp lệ! Vui lòng kiểm tra lại trong Settings → API Configuration.';
      } else if (error.message && error.message.includes('quota')) {
        errorMessage = 'OpenAI API đã hết quota! Vui lòng kiểm tra tài khoản OpenAI của bạn.';
      } else if (error.message && error.message.includes('network')) {
        errorMessage = 'Lỗi kết nối mạng! Vui lòng kiểm tra internet và thử lại.';
      } else if (error.response?.status === 401) {
        errorMessage = 'OpenAI API Key không hợp lệ hoặc đã hết hạn!';
      } else if (error.response?.status === 429) {
        errorMessage = 'Quá nhiều yêu cầu! Vui lòng đợi một chút và thử lại.';
      }
      
      message.error({
        content: errorMessage,
        duration: 5,
      });
    }
  };

  // Handle update button click - save translated data to metafield
  const handleUpdate = async () => {
    const tabIndex = parseInt(activeTab);
    const currentRef = tabRefs.current[tabIndex];
    
    if (!currentRef) {
      message.error('Không tìm thấy form!');
      return;
    }

    const targetLanguage = languages[tabIndex];
    if (!targetLanguage) {
      message.error('Ngôn ngữ không hợp lệ!');
      return;
    }

    try {
      // CHỈ hiện message loading, KHÔNG set isLoading = true
      // (tránh <Spin fullscreen /> che phủ màn hình)
      message.loading('Đang cập nhật...', 0);

      // Get translated values from the form
      const translatedValues = currentRef.formTranslation.getFieldsValue();
      
      // Save each field to metafield
      const namespace = `hrvmultilang_${targetLanguage.code}`;
      
      for (const field of customFields) {
        const value = translatedValues[field.key];
        
        // Skip empty values (but allow HTML content)
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          continue;
        }
        
        // Check if metafield exists for this field
        const existingMetafield = field_data?.metafields?.find(m => m.key === field.key);
        
        const metafieldData = {
          type,
          objectid,
          namespace,
          key: field.key,
          value, // Send as string, backend will handle JSON.stringify
          value_type: 'string', // Always use string for translation fields
          description: field.label || field.key
        };

        if (existingMetafield) {
          // Update existing metafield
          await updateMetafieldMutation.mutateAsync({
            ...metafieldData,
            metafieldid: existingMetafield.id
          });
        } else {
          // Create new metafield
          await createMetafieldMutation.mutateAsync(metafieldData);
        }
      }

      message.destroy();
      message.success(`Cập nhật ${targetLanguage.name} thành công!`);
      
      // Reset isDirty state sau khi lưu thành công
      if (currentRef.resetDirty) {
        currentRef.resetDirty();
      }
      
      // KHÔNG cần reload gì cả!
      // Giá trị trong form đã đúng (user vừa điền)
      // Backend đã lưu thành công
      // Layout giữ nguyên, không có animation
      
    } catch (error) {
      message.destroy();
      message.error(`Lỗi khi cập nhật: ${error.message || 'Unknown error'}`);
    }
  };

  if (product_loading || languagesLoading || configLoading) return <Spin fullscreen />;
  
  // Note: field_loading is handled inside TabMetafields component with overlay
  // to prevent fullscreen white screen when switching tabs

  // Generate tabs dynamically from languages
  const items = languages.map((lang, index) => ({
    key: String(index),
    label: <strong>{lang.name}</strong>,
    children: <TabMetafields 
      ref={el => tabRefs.current[index] = el} 
      productData={product_data}
      customFields={customFields}
      language={lang}
      type={type}
      objectid={objectid}
    />,
  }));

  return (
    <div className='space-y-2!'>
      <div className='sticky top-0 h-min-content bg-white p-4 shadow-md z-10'>
        <Flex justify='space-between' align='center' gap={16}>
          <h2 className='text-lg text-red-600 font-semibold mb-0!'>⁉ Chuyển đổi ngôn ngữ</h2>
          <Space>
            <Button 
              icon={<TranslationOutlined />}
              onClick={handleAutoTranslate}
              loading={isTranslating}
            >
              Dịch tự động
            </Button>
            <Button 
              type='primary' 
              onClick={handleUpdate}
              disabled={!hasChanges}
            >
              Cập nhật
            </Button>
          </Space>
        </Flex>
      </div>
      <div className='p-4'>
        <Tabs
          activeKey={activeTab} 
          onChange={handleTabChange}
          items={items}
          destroyOnHidden={false} 
        />
      </div>
    </div>
  );
};

export default Metafields;  