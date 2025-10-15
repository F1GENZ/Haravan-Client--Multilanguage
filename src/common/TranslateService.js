// OpenAI Translation Service via Server Proxy
import httpClient from "../config/AxiosConfig";
/**
 * SECURITY NOTE / LƯU Ý BẢO MẬT:
 * - API Key và Custom Prompt được lưu trong localStorage (client-side only)
 * - API Key được gửi qua server proxy để tránh CORS và bảo mật hơn
 * - Mỗi máy tính/trình duyệt cần cấu hình riêng
 * - Nếu xóa cache browser, dữ liệu sẽ bị mất
 * - Khuyến nghị: Backup API Key ở nơi an toàn (password manager)
 * 
 * localStorage keys:
 * - 'openai_settings': { apiKey, customPrompt }
 * - 'app_languages': [{ id, code, name, isDefault }]
 */

// Get API settings from localStorage
const getApiSettings = () => {
  const saved = localStorage.getItem('openai_settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    apiKey: '',
    customPrompt: '' // Custom prompt is optional
  };
};

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
 * Translate text using OpenAI ChatGPT API via server proxy
 * @param {string} text - Text to translate
 * @param {object} options - Translation options
 * @param {string} options.targetLanguage - Target language code from active tab (e.g., 'en', 'fr')
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
  
  const settings = getApiSettings();
  
  if (!settings.apiKey) {
    throw new Error('OpenAI API Key chưa được cấu hình. Vui lòng vào Settings để thiết lập.');
  }

  try {
    const response = await httpClient.post('/api/translate/text', {
      text,
      targetLanguage,
      apiKey: settings.apiKey,
      customPrompt: settings.customPrompt
    });

    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(errorMessage);
  }
};

/**
 * Translate multiple texts in batch
 * @param {string[]} texts - Array of texts to translate
 * @param {object} options - Translation options
 * @returns {Promise<string[]>} Array of translated texts
 */
export const translateBatch = async (texts, options = {}) => {
  try {
    const promises = texts.map(text => translateText(text, options));
    return await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

/**
 * Translate HTML content while preserving tags via server proxy
 * @param {string} html - HTML content to translate
 * @param {object} options - Translation options
 * @param {string} options.targetLanguage - Target language code from active tab
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
  
  const settings = getApiSettings();
  
  if (!settings.apiKey) {
    throw new Error('OpenAI API Key chưa được cấu hình. Vui lòng vào Settings để thiết lập.');
  }

  try {
    const response = await httpClient.post('/api/translate/html', {
      html,
      targetLanguage,
      apiKey: settings.apiKey,
      customPrompt: settings.customPrompt
    });

    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(errorMessage);
  }
};

// Language codes mapping
export const LANGUAGE_CODES = LANGUAGE_NAMES;

export default {
  translateText,
  translateBatch,
  translateHTML,
  LANGUAGE_CODES,
};
