// Translation Service via Server Proxy - Gemini API
import httpClient from "../config/AxiosConfig";

/**
 * UPDATED: API Key is now managed server-side
 * No more client-side API key management needed
 */

// Language code to name mapping
const LANGUAGE_NAMES = {
  'vi': 'Vietnamese',
  'en': 'English',
  'fr': 'French',
  'de': 'German',
  'es': 'Spanish',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'zh-TW': 'Traditional Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'id': 'Indonesian',
};

/**
 * Translate a single text field
 * @param {string} text - Text to translate
 * @param {object} options - Translation options
 * @param {string} options.targetLanguage - Target language code
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, options = {}) => {
  const { targetLanguage } = options;
  
  if (!text || text.trim() === '') {
    return '';
  }
  
  if (!targetLanguage) {
    throw new Error('Target language is required');
  }

  try {
    const response = await httpClient.post('/api/translate/text', {
      text,
      targetLanguage
    });

    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(errorMessage);
  }
};

/**
 * Translate HTML content while preserving tags
 * @param {string} html - HTML content to translate
 * @param {object} options - Translation options
 * @returns {Promise<string>} Translated HTML
 */
export const translateHTML = async (html, options = {}) => {
  if (!html || html.trim() === '') {
    return '';
  }
  
  const { targetLanguage } = options;
  
  if (!targetLanguage) {
    throw new Error('Target language is required');
  }

  try {
    const response = await httpClient.post('/api/translate/html', {
      html,
      targetLanguage
    });

    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(errorMessage);
  }
};

/**
 * OPTIMIZED: Translate multiple fields in a single API request
 * Reduces N API calls to 1, saving tokens and quota
 * 
 * @param {Array<{key: string, value: string, type: 'text' | 'html'}>} fields - Fields to translate
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} Object with key -> translated value mapping
 */
export const translateFields = async (fields, targetLanguage) => {
  if (!fields || fields.length === 0) {
    return {};
  }
  
  if (!targetLanguage) {
    throw new Error('Target language is required');
  }

  try {
    const response = await httpClient.post('/api/translate/fields', {
      fields,
      targetLanguage
    });

    // Convert array response to object { key: translatedValue }
    const result = {};
    if (response.data.success && response.data.data) {
      for (const item of response.data.data) {
        if (item.success) {
          result[item.key] = item.translated;
        } else {
          // On error, keep original value
          const original = fields.find(f => f.key === item.key);
          result[item.key] = original?.value || '';
        }
      }
    }

    return result;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(errorMessage);
  }
};

/**
 * Legacy: Translate multiple texts in batch (uses individual calls)
 * @deprecated Use translateFields instead for better performance
 */
export const translateBatch = async (texts, options = {}) => {
  try {
    const promises = texts.map(text => translateText(text, options));
    return await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

// Export
export const LANGUAGE_CODES = LANGUAGE_NAMES;

export default {
  translateText,
  translateHTML,
  translateFields,
  translateBatch,
  LANGUAGE_CODES,
};
