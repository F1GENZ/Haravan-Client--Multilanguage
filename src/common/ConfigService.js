import { useMemo } from 'react';
import { metafieldsService } from './MetafieldsServices';

/**
 * Custom hook to get all config settings from shop metafield
 * @returns {Object} { currencySettings, productFields, collectionFields, configData, isLoading, refetch }
 */
export const useConfigSettings = () => {
  const { data: configData, isLoading, refetch } = metafieldsService.useGetMetafields({ 
    type: 'shop', 
    namespace: 'hrvmultilang_config', 
    objectid: '0' 
  });

  // Parse currency settings
  const currencySettings = useMemo(() => {
    if (!configData || configData.length === 0) {
      return {
        enabled: false,
        autoDetect: true,
        showSymbol: true,
      };
    }
    
    const currencyMetafield = configData.find(m => m.key === 'currency_settings');
    if (!currencyMetafield) {
      return {
        enabled: false,
        autoDetect: true,
        showSymbol: true,
      };
    }
    
    try {
      const parsed = typeof currencyMetafield.value === 'string' 
        ? JSON.parse(currencyMetafield.value) 
        : currencyMetafield.value;
      return parsed || {
        enabled: false,
        autoDetect: true,
        showSymbol: true,
      };
    } catch (error) {
      return {
        enabled: false,
        autoDetect: true,
        showSymbol: true,
      };
    }
  }, [configData]);

  // Parse product fields
  const productFields = useMemo(() => {
    // Built-in fields (always present)
    const builtInFields = [
      { id: 'builtin-1', key: 'title', fieldType: 'string', label: 'Tiêu đề' },
      { id: 'builtin-2', key: 'description', fieldType: 'html', label: 'Mô tả' },
    ];

    if (!configData || configData.length === 0) {
      return builtInFields;
    }
    
    const fieldsMetafield = configData.find(m => m.key === 'product_fields');
    if (!fieldsMetafield) {
      return builtInFields;
    }
    
    try {
      const parsed = typeof fieldsMetafield.value === 'string' 
        ? JSON.parse(fieldsMetafield.value) 
        : fieldsMetafield.value;
      
      // Get custom fields from metafield and filter out any built-in that might have been saved
      const customFields = (parsed.fields || []).filter(f => 
        !['builtin-1', 'builtin-2'].includes(f.id) && 
        !['title', 'description'].includes(f.key)
      );
      
      // Combine built-in fields with custom fields from metafield
      return [...builtInFields, ...customFields];
    } catch (error) {
      return builtInFields;
    }
  }, [configData]);

  // Parse collection fields
  const collectionFields = useMemo(() => {
    // Built-in fields (always present)
    const builtInFields = [
      { id: 'builtin-1', key: 'title', fieldType: 'string', label: 'Tiêu đề' },
      { id: 'builtin-2', key: 'description', fieldType: 'html', label: 'Mô tả' },
    ];

    if (!configData || configData.length === 0) {
      return builtInFields;
    }
    
    const fieldsMetafield = configData.find(m => m.key === 'collection_fields');
    if (!fieldsMetafield) {
      return builtInFields;
    }
    
    try {
      const parsed = typeof fieldsMetafield.value === 'string' 
        ? JSON.parse(fieldsMetafield.value) 
        : fieldsMetafield.value;
      
      // Get custom fields from metafield and filter out any built-in that might have been saved
      const customFields = (parsed.fields || []).filter(f => 
        !['builtin-1', 'builtin-2'].includes(f.id) && 
        !['title', 'description'].includes(f.key)
      );
      
      // Combine built-in fields with custom fields from metafield
      return [...builtInFields, ...customFields];
    } catch (error) {
      return builtInFields;
    }
  }, [configData]);

  return {
    currencySettings,
    productFields,
    collectionFields,
    configData,
    isLoading,
    refetch,
  };
};
