import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Space, Divider, Typography, message, Table, Modal, Tag, Tabs, Alert, Progress, Spin } from 'antd';
import { SettingOutlined, PlusOutlined, EditOutlined, DeleteOutlined, GlobalOutlined, AppstoreOutlined, StarOutlined, InfoCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { metafieldsService } from '../../common/MetafieldsServices';
import { useLanguages } from '../../common/LanguageService';
import { useConfigSettings } from '../../common/ConfigService';
import httpClient from '../../config/AxiosConfig';

const { Title, Text } = Typography;
const { Option } = Select;

// Quota Display Component with Progress Bar
const QuotaDisplay = () => {
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await httpClient.get('/api/translate/quota');
        if (response.data?.success) {
          setQuota(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch quota:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuota();
  }, []);

  if (loading) {
    return <Spin tip="Đang tải..." />;
  }

  if (!quota) {
    return <Alert type="warning" message="Không thể tải thông tin quota" />;
  }

  const usedPercent = Math.round((quota.used / quota.max) * 100);
  const isLow = quota.remaining < 50;
  const isEmpty = quota.remaining === 0;

  return (
    <div className="space-y-4">
      <Alert
        message="Liên hệ hỗ trợ nếu cần nâng cấp quota"
        type="info"
        showIcon
        className="mb-4!"
      />
      
      <div className="p-4! bg-gray-50! rounded-lg!">
        <div className="flex! justify-between! mb-2!">
          <Text strong>Quota đã sử dụng</Text>
          <Text type={isEmpty ? 'danger' : isLow ? 'warning' : 'secondary'}>
            {quota.used} / {quota.max} bản dịch
          </Text>
        </div>
        
        <Progress 
          percent={usedPercent} 
          status={isEmpty ? 'exception' : isLow ? 'active' : 'normal'}
          strokeColor={isEmpty ? '#ff4d4f' : isLow ? '#faad14' : '#1890ff'}
          trailColor="#e8e8e8"
          size="default"
        />
        
        <div className="flex! justify-between! mt-2!">
          <Text type="secondary">Còn lại: <Text strong style={{ color: isEmpty ? '#ff4d4f' : isLow ? '#faad14' : '#52c41a' }}>{quota.remaining}</Text> bản dịch</Text>
          {isEmpty && (
            <Tag color="red">Hết quota</Tag>
          )}
          {isLow && !isEmpty && (
            <Tag color="orange">Sắp hết</Tag>
          )}
        </div>
      </div>
    </div>
  );
};

// Danh sách tất cả ngôn ngữ theo chuẩn ISO 639-1
const AVAILABLE_LANGUAGES = [
  // A
  { code: 'aa', name: 'Afar' },
  { code: 'ab', name: 'Abkhazian' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'ak', name: 'Akan' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'an', name: 'Aragonese' },
  { code: 'hy', name: 'Armenian' },
  { code: 'as', name: 'Assamese' },
  { code: 'av', name: 'Avaric' },
  { code: 'ae', name: 'Avestan' },
  { code: 'ay', name: 'Aymara' },
  { code: 'az', name: 'Azerbaijani' },
  
  // B
  { code: 'ba', name: 'Bashkir' },
  { code: 'bm', name: 'Bambara' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bh', name: 'Bihari' },
  { code: 'bi', name: 'Bislama' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'br', name: 'Breton' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'my', name: 'Burmese' },
  
  // C
  { code: 'ca', name: 'Catalan' },
  { code: 'ch', name: 'Chamorro' },
  { code: 'ce', name: 'Chechen' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'cu', name: 'Church Slavic' },
  { code: 'cv', name: 'Chuvash' },
  { code: 'kw', name: 'Cornish' },
  { code: 'co', name: 'Corsican' },
  { code: 'cr', name: 'Cree' },
  { code: 'cs', name: 'Czech' },
  
  // D
  { code: 'da', name: 'Danish' },
  { code: 'dv', name: 'Divehi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'dz', name: 'Dzongkha' },
  
  // E
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'ee', name: 'Ewe' },
  
  // F
  { code: 'fo', name: 'Faroese' },
  { code: 'fj', name: 'Fijian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fy', name: 'Western Frisian' },
  { code: 'ff', name: 'Fulah' },
  
  // G
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'gd', name: 'Gaelic' },
  { code: 'ga', name: 'Irish' },
  { code: 'gl', name: 'Galician' },
  { code: 'gv', name: 'Manx' },
  { code: 'el', name: 'Greek' },
  { code: 'gn', name: 'Guarani' },
  { code: 'gu', name: 'Gujarati' },
  
  // H
  { code: 'ht', name: 'Haitian' },
  { code: 'ha', name: 'Hausa' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hz', name: 'Herero' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ho', name: 'Hiri Motu' },
  { code: 'hr', name: 'Croatian' },
  { code: 'hu', name: 'Hungarian' },
  
  // I
  { code: 'ig', name: 'Igbo' },
  { code: 'is', name: 'Icelandic' },
  { code: 'io', name: 'Ido' },
  { code: 'ii', name: 'Sichuan Yi' },
  { code: 'iu', name: 'Inuktitut' },
  { code: 'ie', name: 'Interlingue' },
  { code: 'ia', name: 'Interlingua' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ik', name: 'Inupiaq' },
  { code: 'it', name: 'Italian' },
  
  // J
  { code: 'jv', name: 'Javanese' },
  { code: 'ja', name: 'Japanese' },
  
  // K
  { code: 'kl', name: 'Kalaallisut' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'kr', name: 'Kanuri' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'ki', name: 'Kikuyu' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'kv', name: 'Komi' },
  { code: 'kg', name: 'Kongo' },
  { code: 'ko', name: 'Korean' },
  { code: 'kj', name: 'Kuanyama' },
  { code: 'ku', name: 'Kurdish' },
  
  // L
  { code: 'la', name: 'Latin' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'lg', name: 'Ganda' },
  { code: 'li', name: 'Limburgish' },
  { code: 'ln', name: 'Lingala' },
  { code: 'lo', name: 'Lao' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  
  // M
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mh', name: 'Marshallese' },
  { code: 'mn', name: 'Mongolian' },
  
  // N
  { code: 'na', name: 'Nauru' },
  { code: 'nv', name: 'Navajo' },
  { code: 'nd', name: 'North Ndebele' },
  { code: 'nr', name: 'South Ndebele' },
  { code: 'ng', name: 'Ndonga' },
  { code: 'ne', name: 'Nepali' },
  { code: 'nn', name: 'Norwegian Nynorsk' },
  { code: 'nb', name: 'Norwegian Bokmål' },
  { code: 'no', name: 'Norwegian' },
  
  // O
  { code: 'oc', name: 'Occitan' },
  { code: 'oj', name: 'Ojibwa' },
  { code: 'or', name: 'Oriya' },
  { code: 'om', name: 'Oromo' },
  { code: 'os', name: 'Ossetian' },
  
  // P
  { code: 'pa', name: 'Punjabi' },
  { code: 'pi', name: 'Pali' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'ps', name: 'Pashto' },
  
  // Q
  { code: 'qu', name: 'Quechua' },
  
  // R
  { code: 'rm', name: 'Romansh' },
  { code: 'ro', name: 'Romanian' },
  { code: 'rn', name: 'Rundi' },
  { code: 'ru', name: 'Russian' },
  
  // S
  { code: 'sg', name: 'Sango' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'se', name: 'Northern Sami' },
  { code: 'sm', name: 'Samoan' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'so', name: 'Somali' },
  { code: 'st', name: 'Southern Sotho' },
  { code: 'es', name: 'Spanish' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'sc', name: 'Sardinian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'ss', name: 'Swati' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  
  // T
  { code: 'ty', name: 'Tahitian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'tg', name: 'Tajik' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'th', name: 'Thai' },
  { code: 'ti', name: 'Tigrinya' },
  { code: 'to', name: 'Tonga' },
  { code: 'tn', name: 'Tswana' },
  { code: 'ts', name: 'Tsonga' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tw', name: 'Twi' },
  
  // U
  { code: 'ug', name: 'Uighur' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'uz', name: 'Uzbek' },
  
  // V
  { code: 've', name: 'Venda' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'vo', name: 'Volapük' },
  
  // W
  { code: 'wa', name: 'Walloon' },
  { code: 'wo', name: 'Wolof' },
  
  // X
  { code: 'xh', name: 'Xhosa' },
  
  // Y
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  
  // Z
  { code: 'za', name: 'Zhuang' },
  { code: 'zu', name: 'Zulu' },
  
  // Persian
  { code: 'fa', name: 'Persian' },
];

const Settings = () => {
  const [languageForm] = Form.useForm();
  const [fieldForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [activeFieldTab, setActiveFieldTab] = useState('product');

  // Fetch languages from shop metafield using custom hook
  const { languages, isLoading: languagesLoading, refetch: refetchLanguages, languagesData } = useLanguages();
  
  // Fetch config settings (currency, fields) from shop metafield
  const { 
    currencySettings, 
    productFields, 
    collectionFields, 
    configData, 
    isLoading: configLoading, 
    refetch: refetchConfig 
  } = useConfigSettings();

  // Mutation hooks for metafields
  const createFieldMutation = metafieldsService.useCreateField();
  const updateFieldMutation = metafieldsService.useUpdateField();
  const deleteFieldMutation = metafieldsService.useDeleteField();


  // ============ LANGUAGE FUNCTIONS ============
  const handleAddLanguage = () => {
    setEditingLanguage(null);
    languageForm.resetFields();
    setLanguageModalVisible(true);
  };

  const handleSetDefaultLanguage = async (id) => {
    try {
      const languagesMetafield = languagesData?.find(m => m.key === 'languages');
      if (!languagesMetafield) {
        message.error('Không tìm thấy dữ liệu ngôn ngữ!');
        return;
      }

      const updatedLanguages = languages.map(lang => ({
        ...lang,
        isDefault: lang.id === id
      }));

      // Get the default language code
      const defaultLang = updatedLanguages.find(lang => lang.isDefault);

      // Update languages metafield
      await updateFieldMutation.mutateAsync({
        type: 'shop',
        objectid: '0',
        key: 'languages',
        value: {
          languages: updatedLanguages
        },
        namespace: 'hrvmultilang_config',
        metafieldid: languagesMetafield.id,
      });

      // Create/update default_language metafield for easy Liquid access
      const defaultLangMetafield = languagesData?.find(m => m.key === 'default_language');
      
      if (defaultLangMetafield) {
        // Update existing
        await updateFieldMutation.mutateAsync({
          type: 'shop',
          objectid: '0',
          key: 'default_language',
          value: defaultLang.code,
          namespace: 'hrvmultilang_config',
          metafieldid: defaultLangMetafield.id,
        });
      } else {
        // Create new
        await createFieldMutation.mutateAsync({
          type: 'shop',
          objectid: '0',
          key: 'default_language',
          value: defaultLang.code,
          namespace: 'hrvmultilang_config',
        });
      }

      await refetchLanguages();
      message.success('Đã đặt ngôn ngữ mặc định!');
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // ============ CURRENCY HANDLERS ============
  const handleCurrencySettingsChange = async (field, value) => {
    try {
      const currencyMetafield = configData?.find(m => m.key === 'currency_settings');
      
      const newSettings = {
        ...currencySettings,
        [field]: value
      };

      if (currencyMetafield) {
        // Update existing
        await updateFieldMutation.mutateAsync({
          type: 'shop',
          objectid: '0',
          key: 'currency_settings',
          value: newSettings,
          namespace: 'hrvmultilang_config',
          metafieldid: currencyMetafield.id,
        });
      } else {
        // Create new
        await createFieldMutation.mutateAsync({
          type: 'shop',
          objectid: '0',
          key: 'currency_settings',
          value: newSettings,
          namespace: 'hrvmultilang_config',
        });
      }

      await refetchConfig();
      message.success('Đã cập nhật cấu hình tiền tệ!');
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // ============ FIELD HANDLERS ============

  const handleDeleteLanguage = async (id) => {
    const language = languages.find(lang => lang.id === id);
    if (language?.isDefault) {
      message.error('Không thể xóa ngôn ngữ mặc định!');
      return;
    }
    
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ngôn ngữ này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const languagesMetafield = languagesData?.find(m => m.key === 'languages');
          if (!languagesMetafield) {
            message.error('Không tìm thấy dữ liệu ngôn ngữ!');
            return;
          }

          const updatedLanguages = languages.filter(lang => lang.id !== id);

          await updateFieldMutation.mutateAsync({
            type: 'shop',
            objectid: '0',
            key: 'languages',
            value: {
              languages: updatedLanguages
            },
            namespace: 'hrvmultilang_config',
            metafieldid: languagesMetafield.id,
          });

          await refetchLanguages();
          message.success('Xóa ngôn ngữ thành công!');
        } catch (error) {
          message.error('Có lỗi xảy ra!');
        }
      },
    });
  };

  const handleLanguageSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedLang = AVAILABLE_LANGUAGES.find(l => l.code === values.code);
      
      // Get current languages metafield
      const languagesMetafield = languagesData?.find(m => m.key === 'languages');
      
      const isFirstLanguage = languages.length === 0;
      const newLang = { 
        id: Date.now(), 
        code: values.code, 
        name: selectedLang.name,
        isDefault: isFirstLanguage, // First language is default
      };
      
      const updatedLanguages = [...languages, newLang];
      
      const metafieldData = {
        type: 'shop',
        objectid: '0',
        key: 'languages',
        value: {
          languages: updatedLanguages
        },
        namespace: 'hrvmultilang_config',
      };

      if (languagesMetafield) {
        // Update existing metafield
        await updateFieldMutation.mutateAsync({
          ...metafieldData,
          metafieldid: languagesMetafield.id,
        });
      } else {
        // Create new metafield
        await createFieldMutation.mutateAsync(metafieldData);
      }

      // If first language, also create default_language metafield
      if (isFirstLanguage) {
        const defaultLangMetafield = languagesData?.find(m => m.key === 'default_language');
        
        if (defaultLangMetafield) {
          await updateFieldMutation.mutateAsync({
            type: 'shop',
            objectid: '0',
            key: 'default_language',
            value: newLang.code,
            namespace: 'hrvmultilang_config',
            metafieldid: defaultLangMetafield.id,
          });
        } else {
          await createFieldMutation.mutateAsync({
            type: 'shop',
            objectid: '0',
            key: 'default_language',
            value: newLang.code,
            namespace: 'hrvmultilang_config',
          });
        }
      }

      await refetchLanguages();
      
      message.success('Thêm ngôn ngữ thành công!');

      setLanguageModalVisible(false);
      languageForm.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  // ============ CUSTOM FIELD FUNCTIONS ============
  const handleAddField = (type) => {
    setEditingField(null);
    fieldForm.resetFields();
    fieldForm.setFieldsValue({ type });
    setFieldModalVisible(true);
  };

  const handleDeleteField = async (id, type) => {
    // Tìm field cần xóa
    const fields = type === 'product' ? productFields : collectionFields;
    const fieldToDelete = fields.find(field => field.id === id);
    
    // Kiểm tra nếu là built-in field
    const isBuiltIn = 
      fieldToDelete && (
        ['title', 'description', 'product_type', 'vendor'].includes(fieldToDelete.key) ||
        ['builtin-1', 'builtin-2', 'builtin-3', 'builtin-4'].includes(fieldToDelete.id)
      );
      
    if (isBuiltIn) {
      message.error('Không thể xóa trường mặc định!');
      return;
    }
    
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa trường này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const metafieldKey = type === 'product' ? 'product_fields' : 'collection_fields';
          const fieldsMetafield = configData?.find(m => m.key === metafieldKey);
          
          if (!fieldsMetafield) {
            message.error('Không tìm thấy dữ liệu!');
            return;
          }

          // Filter out the deleted field AND built-in fields
          const updatedFields = fields
            .filter(field => field.id !== id)
            .filter(f => 
              !['builtin-1', 'builtin-2', 'builtin-3', 'builtin-4'].includes(f.id) && 
              !['title', 'description', 'product_type', 'vendor'].includes(f.key)
            );

          await updateFieldMutation.mutateAsync({
            type: 'shop',
            objectid: '0',
            key: metafieldKey,
            value: {
              fields: updatedFields
            },
            namespace: 'hrvmultilang_config',
            metafieldid: fieldsMetafield.id,
          });

          await refetchConfig();
          message.success('Xóa trường thành công!');
        } catch (error) {
          message.error('Có lỗi xảy ra!');
        }
      },
    });
  };

  const handleFieldSubmit = async (values) => {
    setLoading(true);
    try {
      const metafieldKey = values.type === 'product' ? 'product_fields' : 'collection_fields';
      const currentFields = values.type === 'product' ? productFields : collectionFields;
      const fieldsMetafield = configData?.find(m => m.key === metafieldKey);
      
      const newField = {
        id: Date.now(),
        key: values.key,
        fieldType: values.fieldType,
        label: values.label,
      };

      // Filter out built-in fields (title, description) before saving
      const customFieldsOnly = currentFields.filter(f => 
        !['builtin-1', 'builtin-2', 'builtin-3', 'builtin-4'].includes(f.id) && 
        !['title', 'description', 'product_type', 'vendor'].includes(f.key)
      );
      
      const updatedFields = [...customFieldsOnly, newField];

      if (fieldsMetafield) {
        // Update existing
        await updateFieldMutation.mutateAsync({
          type: 'shop',
          objectid: '0',
          key: metafieldKey,
          value: {
            fields: updatedFields
          },
          namespace: 'hrvmultilang_config',
          metafieldid: fieldsMetafield.id,
        });
      } else {
        // Create new
        await createFieldMutation.mutateAsync({
          type: 'shop',
          objectid: '0',
          key: metafieldKey,
          value: {
            fields: updatedFields
          },
          namespace: 'hrvmultilang_config',
        });
      }

      await refetchConfig();
      message.success('Thêm trường thành công!');

      setFieldModalVisible(false);
      fieldForm.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  // ============ TABLE COLUMNS ============
  const languageColumns = [
    {
      title: 'Mã ngôn ngữ',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Tag color="blue">{code.toUpperCase()}</Tag>,
    },
    {
      title: 'Tên ngôn ngữ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mặc định',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault, record) => (
        <Button
          type={isDefault ? "primary" : "default"}
          size="small"
          icon={<StarOutlined />}
          onClick={() => handleSetDefaultLanguage(record.id)}
          disabled={isDefault}
        >
          {isDefault ? 'Mặc định' : 'Đặt mặc định'}
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleDeleteLanguage(record.id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const createFieldColumns = (type) => {
    // Lấy ngôn ngữ mặc định để hiển thị ví dụ
    const defaultLang = languages.find(lang => lang.isDefault) || languages[0] || { code: 'vi' };
    
    return [
      {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
        render: (key) => <code className="bg-gray-100 px-2 py-1 rounded">{type}.metafields.hrvmultilang_{defaultLang.code}.{key}</code>,
      },
      {
        title: 'Loại',
      dataIndex: 'fieldType',
      key: 'fieldType',
      render: (fieldType) => (
        <Tag color={fieldType === 'string' ? 'blue' : 'purple'}>
          {fieldType === 'string' ? 'String (Input)' : 'HTML (Editor)'}
        </Tag>
      ),
    },
    {
      title: 'Tên trường',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        // Không hiển thị nút xóa cho built-in fields
        const isBuiltIn = 
          ['title', 'description', 'product_type', 'vendor'].includes(record.key) ||
          ['builtin-1', 'builtin-2', 'builtin-3', 'builtin-4'].includes(record.id);
          
        if (isBuiltIn) {
          return <Tag color="green">Trường mặc định</Tag>;
        }
        
        return (
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteField(record.id, type)}
          >
            Xóa
          </Button>
        );
      },
    },
  ];
  };

  const fieldTabs = [
    {
      key: 'product',
      label: (
        <span>
          <AppstoreOutlined /> Product Fields
        </span>
      ),
      children: (
        <div>
          <Alert
            message="Lưu ý"
            description="Trường Title, Description, Product Type và Vendor là mặc định, luôn luôn có và không thể xóa. Các trường dưới đây là trường bổ sung (custom fields)."
            type="info"
            showIcon
            className="mb-4!"
          />
          <div className="mb-4! flex! justify-end!">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleAddField('product')}
            >
              Thêm trường Product
            </Button>
          </div>
          <Table 
            columns={createFieldColumns('product')} 
            dataSource={productFields}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'collection',
      label: (
        <span>
          <AppstoreOutlined /> Collection Fields
        </span>
      ),
      children: (
        <div>
          <Alert
            message="Lưu ý"
            description="Trường Title và Description là mặc định, luôn luôn có và không thể xóa. Các trường dưới đây là trường bổ sung (custom fields)."
            type="info"
            showIcon
            className="mb-4!"
          />
          <div className="mb-4! flex! justify-end!">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleAddField('collection')}
            >
              Thêm trường Collection
            </Button>
          </div>
          <Table 
            columns={createFieldColumns('collection')} 
            dataSource={collectionFields}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div>
        <div className="mb-8">
          <Title level={2}>
            <SettingOutlined className="mr-2" />
            Cài đặt
          </Title>
          <Text type="secondary">
            Quản lý ngôn ngữ và trường tùy chỉnh
          </Text>
        </div>

        <div className="space-y-4!">
          {/* SECTION 1: Quản lý ngôn ngữ */}
          <Card 
            title={
              <span>
                <GlobalOutlined className="mr-2" />
                Quản lý ngôn ngữ
              </span>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddLanguage}
              >
                Thêm ngôn ngữ
              </Button>
            }
            className="shadow-sm"
          >
            <Table 
              columns={languageColumns} 
              dataSource={languages}
              rowKey="id"
              pagination={false}
              loading={languagesLoading}
              locale={{
                emptyText: 'Chưa có ngôn ngữ nào. Nhấn "Thêm ngôn ngữ" để bắt đầu.'
              }}
            />
          </Card>

          {/* SECTION 2: Quản lý tiền tệ */}
          <Card 
            title={
              <span>
                <DollarOutlined className="mr-2" />
                Quản lý tiền tệ
              </span>
            }
            className="shadow-sm"
          >
            <Table 
              columns={[
                {
                  title: 'Tính năng',
                  dataIndex: 'feature',
                  key: 'feature',
                  width: '40%',
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'value',
                  key: 'value',
                  render: (value, record) => {
                    if (record.key === 'enabled') {
                      return (
                        <input
                          type="checkbox"
                          className="w-5! h-5! cursor-pointer!"
                          checked={currencySettings.enabled}
                          onChange={(e) => handleCurrencySettingsChange('enabled', e.target.checked)}
                        />
                      );
                    }
                    if (record.key === 'autoDetect') {
                      return (
                        <input
                          type="checkbox"
                          className="w-5! h-5! cursor-pointer!"
                          checked={currencySettings.autoDetect}
                          onChange={(e) => handleCurrencySettingsChange('autoDetect', e.target.checked)}
                        />
                      );
                    }
                    return value;
                  }
                }
              ]}
              dataSource={[
                { key: 'enabled', feature: 'Bật chuyển đổi tiền tệ' },
                { key: 'autoDetect', feature: 'Tự động phát hiện tiền tệ theo ngôn ngữ' },
              ]}
              pagination={false}
              size="small"
            />
          </Card>

          {/* SECTION 3: Quản lý trường tùy chỉnh */}
          <Card 
            title="Quản lý trường tùy chỉnh"
            className="shadow-sm"
          >
            <Tabs 
              items={fieldTabs}
              activeKey={activeFieldTab}
              onChange={setActiveFieldTab}
            />
          </Card>

          {/* SECTION 4: Quota dịch thuật */}
          <Card 
            title={
              <span>
                <SettingOutlined className="mr-2" />
                Quota dịch thuật
              </span>
            }
            className="shadow-sm"
          >
            <QuotaDisplay />
          </Card>
        </div>

        {/* MODAL: Thêm/Sửa ngôn ngữ */}
        <Modal
          title={editingLanguage ? 'Chỉnh sửa ngôn ngữ' : 'Thêm ngôn ngữ mới'}
          open={languageModalVisible}
          onCancel={() => {
            setLanguageModalVisible(false);
            languageForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={languageForm}
            layout="vertical"
            onFinish={handleLanguageSubmit}
          >
            <Form.Item
              label="Chọn ngôn ngữ"
              name="code"
              rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ!' }]}
            >
              <Select 
                placeholder="Chọn ngôn ngữ"
                showSearch
                filterOption={(input, option) => {
                  const searchText = input.toLowerCase();
                  // Use option.value (code) or extract from children
                  const langCode = option.value?.toLowerCase() || '';
                  const langText = option.children ? String(option.children).toLowerCase() : '';
                  return langText.includes(searchText) || langCode.includes(searchText);
                }}
              >
                {AVAILABLE_LANGUAGES
                  .filter(lang => !languages.some(l => l.code === lang.code))
                  .map(lang => (
                    <Option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.code})
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingLanguage ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button onClick={() => {
                  setLanguageModalVisible(false);
                  languageForm.resetFields();
                }}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* MODAL: Thêm/Sửa trường tùy chỉnh */}
        <Modal
          title={editingField ? 'Chỉnh sửa trường' : 'Thêm trường tùy chỉnh'}
          open={fieldModalVisible}
          onCancel={() => {
            setFieldModalVisible(false);
            fieldForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={fieldForm}
            layout="vertical"
            onFinish={handleFieldSubmit}
          >
            <Form.Item name="type" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Key (Khóa)"
              name="key"
              rules={[
                { required: true, message: 'Vui lòng nhập key!' },
                { pattern: /^[a-z_]+$/, message: 'Key chỉ được chứa chữ thường và dấu gạch dưới!' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    
                    const reservedKeys = ['title', 'description', 'product_type', 'vendor'];
                    if (reservedKeys.includes(value.toLowerCase())) {
                      return Promise.reject(new Error('Key này là trường mặc định, không thể sử dụng!'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              extra={
                <Text type="secondary">
                  {(() => {
                    const defaultLang = languages.find(lang => lang.isDefault) || languages[0] || { code: 'vi' };
                    const type = fieldForm.getFieldValue('type') || activeFieldTab;
                    return (
                      <>
                        Namespace sẽ là: <code>{type}.metafields.hrvmultilang_{defaultLang.code}.{'{key}'}</code>
                        <br />
                        <span className="text-xs!">Ví dụ: <code>{type}.metafields.hrvmultilang_{defaultLang.code}.seo_title</code></span>
                        <br />
                        <span className="text-red-500! text-xs!">⚠️ Không được dùng: title, description, product_type, vendor</span>
                      </>
                    );
                  })()}
                </Text>
              }
            >
              <Input placeholder="vd: seo_title, meta_description" />
            </Form.Item>

            <Form.Item
              label="Loại trường"
              name="fieldType"
              rules={[{ required: true, message: 'Vui lòng chọn loại trường!' }]}
              tooltip="String sẽ hiển thị Input, HTML sẽ hiển thị Editor"
            >
              <Select placeholder="Chọn loại trường">
                <Option value="string">String (Input)</Option>
                <Option value="html">HTML (Editor)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Tên trường (Label)"
              name="label"
              rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
            >
              <Input placeholder="VD: Phụ đề, Banner text, ..." />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingField ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button onClick={() => {
                  setFieldModalVisible(false);
                  fieldForm.resetFields();
                }}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Settings;
