import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form, Input, Flex, Spin } from 'antd';
import { metafieldsService } from '../../common/MetafieldsServices';
import TinyEditor from '../../components/editor';

const TabMetafields = forwardRef(({ isModalOpen, setIsModalOpen, isLoading, setIsLoading, fields, productData, customFields = [], language, type, objectid }, ref) => {
  const [form] = Form.useForm();
  const [formTranslation] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const [editorContent, setEditorContent] = useState({});
  const [translatedEditorContent, setTranslatedEditorContent] = useState({});
  const editorRefs = useRef({});

  // customFields already includes built-in fields from ConfigService
  // No need to define them again here
  const allFields = customFields;

  // Load metafield data for this language
  const namespace = language ? `hrvmultilang_${language.code}` : 'hrvmultilang_vi';
  const { data: metafieldData, isLoading: metafieldLoading } = metafieldsService.useGetMetafields({ 
    type, 
    namespace, 
    objectid 
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getSourceValues: () => {
      return form.getFieldsValue();
    },
    setTranslatedValues: (values) => {
      formTranslation.setFieldsValue(values);
      // Update TinyEditor content for all HTML fields (including built-in)
      allFields.forEach(field => {
        if (field.fieldType === 'html' && values[field.key] && editorRefs.current[field.key]) {
          editorRefs.current[field.key].setContent(values[field.key]);
        }
      });
      // Set dirty state sau khi dịch tự động
      setIsDirty(true);
    },
    isDirty, // Expose isDirty state to parent
    resetDirty: () => setIsDirty(false), // Method to reset after save
    formTranslation,
    form
  }));

  // Set initial values from product data to the left form (source)
  useEffect(() => {
    if (productData && allFields.length > 0) {
      const initialValues = {};
      const initialEditorContent = {};
      
      allFields.forEach(field => {
        // Map data keys - works for both product and collection
        let value = '';
        if (field.key === 'title') {
          value = productData.title || '';
        } else if (field.key === 'description') {
          // For product: body_html, for collection: description or body_html
          value = productData.body_html || productData.description || '';
        } else if (field.key === 'product_type') {
          value = productData.product_type || '';
        } else if (field.key === 'vendor') {
          value = productData.vendor || '';
        } else {
          value = productData[field.key] || '';
        }
        
        initialValues[field.key] = value;
        
        if (field.fieldType === 'html') {
          initialEditorContent[field.key] = value;
        }
      });
      
      form.setFieldsValue(initialValues);
      setEditorContent(initialEditorContent);
    }
  }, [productData, allFields, form]);

  // Load metafield data into the right form (translation)
  useEffect(() => {
    // Check different possible data structures
    const metafields = metafieldData?.metafields || metafieldData || [];
    
    if (metafields && Array.isArray(metafields) && metafields.length > 0 && allFields.length > 0) {
      const translatedValues = {};
      const translatedEditors = {};
      
      allFields.forEach(field => {
        // Find metafield for this field key
        const metafield = metafields.find(m => m.key === field.key);
        
        if (metafield) {
          translatedValues[field.key] = metafield.value || '';
          
          // Store HTML content for TinyEditor initial value
          if (field.fieldType === 'html') {
            translatedEditors[field.key] = metafield.value || '';
          }
        }
      });
      
      // Update form values
      formTranslation.setFieldsValue(translatedValues);
      
      // Update editor content state to trigger re-render
      setTranslatedEditorContent(translatedEditors);
      
      // Also update existing editors (for cases where editors already mounted)
      setTimeout(() => {
        allFields.forEach(field => {
          if (field.fieldType === 'html' && translatedEditors[field.key] && editorRefs.current[field.key]) {
            editorRefs.current[field.key].setContent(translatedEditors[field.key]);
          }
        });
      }, 500);
    }
  }, [metafieldData, allFields, formTranslation]);

  const createFieldMutation = metafieldsService.useCreateField();
  const updateFieldMutation = metafieldsService.useUpdateField();

  const onFormSubmit = () => {
    setIsLoading(true);
    form.validateFields()
      .then(async (values) => {
        if (values.metafieldid == 0) {
          await createFieldMutation.mutateAsync(values);
        } else {
          await updateFieldMutation.mutateAsync(values);
        }
        setIsModalOpen(false);
      })
      .catch((errorInfo) => {
        // Validation failed - form will show errors automatically
      });
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Flex direction="column" gap={32}>
      {/* Form nguồn (bên trái) - readonly */}
      <div className='flex-5! relative'>
        {metafieldLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded">
            <Spin tip="Đang tải..." />
          </div>
        )}
        <Form
          form={form}
          layout="vertical" 
          className="w-full!"
          onFinish={onFormSubmit}
        >
          {allFields.map(field => (
            <Form.Item 
              key={field.key}
              name={field.key} 
              label={field.label || field.key}
              layout="vertical"
            >
              {field.fieldType === 'string' ? (
                <Input className='cursor-not-allowed! bg-gray-100!' readOnly />
              ) : (
                <TinyEditor 
                  initialValue={editorContent[field.key] || ''}
                  readonly={true}
                  onEditorChange={() => {}} />
              )}
            </Form.Item>
          ))}
        </Form>
      </div>

      {/* Form dịch (bên phải) - editable */}
      <div className='flex-5! relative'>
        {metafieldLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded">
            <Spin tip="Đang tải..." />
          </div>
        )}
        <Form
          form={formTranslation}
          layout="vertical" 
          className="w-full!"
          onFinish={onFormSubmit}
        >
          {allFields.map(field => (
            <Form.Item 
              key={field.key}
              name={field.key} 
              label={field.label || field.key}
              layout="vertical"
            >
              {field.fieldType === 'string' ? (
                <Input 
                  placeholder={`Nhập ${field.label || field.key}...`}
                  onChange={() => setIsDirty(true)}
                />
              ) : (
                <TinyEditor 
                  key={`editor-${language?.code || 'default'}-${field.key}-${translatedEditorContent[field.key] ? 'filled' : 'empty'}`}
                  ref={el => editorRefs.current[field.key] = el}
                  initialValue={translatedEditorContent[field.key] || ''}
                  onEditorChange={(content) => {
                    formTranslation.setFieldsValue({ [field.key]: content });
                    setIsDirty(true);
                  }} />
              )}
            </Form.Item>
          ))}
        </Form>
      </div>
    </Flex>
  );
});

TabMetafields.displayName = 'TabMetafields';

export default TabMetafields;
