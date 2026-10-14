/**
 * Translation Helper Utility
 * 
 * Synchronizes regional language name retrieval across Dashboard,
 * Customisation Live Preview, Summary Tab, Cart, and Checkout.
 * 
 * Strict Rule: Never fall back to Tamil when another regional language is selected!
 */

export const sanitizeScriptText = (text, fallback = '') => {
  if (!text) return fallback;
  const cleaned = String(text)
    .replace(/\(cid:\d+\)/g, '')
    .replace(/[?]{2,}/g, '')
    .trim()
    .replace(/^[()?,.-]+|[()?,.-]+$/g, '')
    .trim();
  if (!cleaned || cleaned.length < 2 || /^[?\s\-()]+$/.test(cleaned)) {
    return fallback;
  }
  return cleaned;
};

export const getTranslatedName = (product, language = 'tamil') => {
  if (!product) return '';
  const lang = (language || 'tamil').toLowerCase().trim();

  // Try exact language key (e.g. teluguName or telugu)
  const directMatch = product[`${lang}Name`] || product[lang];
  const cleanedDirect = sanitizeScriptText(directMatch);
  if (cleanedDirect && cleanedDirect !== product.name) {
    return cleanedDirect;
  }

  // If language is Tamil, allowed to fallback to bilingualName
  if (lang === 'tamil') {
    const tamilFallback = sanitizeScriptText(product.tamilName || product.bilingualName);
    if (tamilFallback && tamilFallback !== product.name) {
      return tamilFallback;
    }
  }

  // Never substitute Tamil for other regional languages (Hindi, Telugu, Kannada, etc.)
  return '';
};

export default {
  getTranslatedName,
  sanitizeScriptText
};
