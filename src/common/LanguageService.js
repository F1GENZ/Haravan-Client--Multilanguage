import { useMemo } from 'react';
import { metafieldsService } from './MetafieldsServices';

/**
 * Custom hook to get languages from shop metafield
 * @returns {Object} { languages: Array, isLoading: Boolean }
 */
export const useLanguages = () => {
  const { data: languagesData, isLoading, refetch } = metafieldsService.useGetMetafields({ 
    type: 'shop', 
    namespace: 'hrvmultilang_config', 
    objectid: '0' 
  });

  const languages = useMemo(() => {
    if (!languagesData || languagesData.length === 0) {
      return [];
    }
    
    const languagesMetafield = languagesData.find(m => m.key === 'languages');
    
    if (!languagesMetafield) {
      return [];
    }
    
    try {
      // Check if value is already an object
      let parsed;
      if (typeof languagesMetafield.value === 'string') {
        parsed = JSON.parse(languagesMetafield.value);
      } else {
        parsed = languagesMetafield.value;
      }
      
      return parsed.languages || [];
    } catch (error) {
      return [];
    }
  }, [languagesData]);

  return {
    languages,
    languagesData,
    isLoading,
    refetch,
  };
};
