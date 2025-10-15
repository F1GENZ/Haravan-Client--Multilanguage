// OpenAI Translation Service
import OpenAI from 'openai';

/**
 * SECURITY NOTE / LƯU Ý BẢO MẬT:
 * - API Key và Custom Prompt được lưu trong localStorage (client-side only)
 * - Dữ liệu KHÔNG được sync lên server vì lý do bảo mật
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
 * Translate text using OpenAI ChatGPT API
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
  
  try {
    const settings = getApiSettings();
    
    if (!settings.apiKey) {
      throw new Error('OpenAI API Key chưa được cấu hình. Vui lòng vào Settings để thiết lập.');
    }

    const openai = new OpenAI({
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true, // Only for development
      baseURL: 'https://api.openai.com/v1',
      timeout: 60000, // 60 seconds timeout
      maxRetries: 2
    });

    const targetLanguageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    
    // Prompt cứng: Dịch theo ngôn ngữ target
    const mainPrompt = `Translate the following text to ${targetLanguageName}. Keep the same tone and style. Only return the translated text without any explanation.`;
    
    // Custom prompt từ Settings (nếu có) sẽ được thêm vào
    const customPrompt = settings.customPrompt && settings.customPrompt.trim() 
      ? `\n\nAdditional requirements: ${settings.customPrompt}` 
      : '';

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: mainPrompt + customPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
      max_completion_tokens: 2000
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    // Re-throw with more specific error messages
    if (error.status === 401) {
      throw new Error('OpenAI API Key không hợp lệ hoặc đã hết hạn');
    } else if (error.status === 429) {
      throw new Error('Quá nhiều yêu cầu tới OpenAI API. Vui lòng đợi và thử lại');
    } else if (error.status === 402 || (error.message && error.message.includes('quota'))) {
      throw new Error('Tài khoản OpenAI đã hết quota. Vui lòng kiểm tra billing');
    } else if (!navigator.onLine) {
      throw new Error('Không có kết nối internet');
    } else if (error.message && error.message.includes('API key')) {
      throw error; // Keep original API key error message
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message?.includes('fetch failed')) {
      throw new Error('Không thể kết nối tới OpenAI. Vui lòng kiểm tra kết nối internet hoặc firewall');
    } else if (error.message?.includes('network') || error.message?.includes('Connection')) {
      throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại');
    }
    throw new Error(`Lỗi khi gọi OpenAI API: ${error.message || 'Unknown error'}`);
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
 * Translate HTML content while preserving tags
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
  
  try {
    const settings = getApiSettings();
    
    if (!settings.apiKey) {
      throw new Error('OpenAI API Key chưa được cấu hình. Vui lòng vào Settings để thiết lập.');
    }

    const openai = new OpenAI({
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true,
      baseURL: 'https://api.openai.com/v1',
      timeout: 60000, // 60 seconds timeout
      maxRetries: 2
    });

    const targetLanguageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    
    // Prompt cứng cho HTML
    const mainPrompt = `Translate the following HTML content to ${targetLanguageName}. Keep the same tone and style. Only return the translated content without any explanation.\n\nIMPORTANT: The input is HTML content. You must preserve ALL HTML tags, attributes, and structure. Only translate the text content inside the tags.`;
    
    // Custom prompt từ Settings (nếu có)
    const customPrompt = settings.customPrompt && settings.customPrompt.trim() 
      ? `\n\nAdditional requirements: ${settings.customPrompt}` 
      : '';

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: mainPrompt + customPrompt
        },
        {
          role: "user",
          content: html
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    // Re-throw with more specific error messages
    if (error.status === 401) {
      throw new Error('OpenAI API Key không hợp lệ hoặc đã hết hạn');
    } else if (error.status === 429) {
      throw new Error('Quá nhiều yêu cầu tới OpenAI API. Vui lòng đợi và thử lại');
    } else if (error.status === 402 || (error.message && error.message.includes('quota'))) {
      throw new Error('Tài khoản OpenAI đã hết quota. Vui lòng kiểm tra billing');
    } else if (!navigator.onLine) {
      throw new Error('Không có kết nối internet');
    } else if (error.message && error.message.includes('API key')) {
      throw error; // Keep original API key error message
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message?.includes('fetch failed')) {
      throw new Error('Không thể kết nối tới OpenAI. Vui lòng kiểm tra kết nối internet hoặc firewall');
    } else if (error.message?.includes('network') || error.message?.includes('Connection')) {
      throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại');
    }
    throw new Error(`Lỗi khi dịch HTML: ${error.message || 'Unknown error'}`);
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
