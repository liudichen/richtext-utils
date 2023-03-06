import { isAllChineseWord, type ObjectStyle } from '@iimm/shared';
import type { WordXmlFonts } from '@/types/index';

export const htmlFontSizeToWordFontSizeNumber = (fontSize?: string | number) => {
  if (!fontSize) return;
  let type = '';
  let number = 0;
  if (typeof fontSize === 'number') {
    type = 'px'; number = fontSize;
  } else if (typeof fontSize === 'string' && /^[\d.]+(pt|px)$/.test(fontSize)) {
    number = +fontSize.slice(0, fontSize.length - 2);
    if (!isNaN(number)) {
      type = fontSize.slice(-2);
    }
  }
  if (type === 'px') { number = number * 3 / 4; type = 'pt'; }
  if (type === 'pt') number = number * 2;
  return Math.round(number || 0);
};

const fontStringTrans = (font: string) => {
  const res = font.replace(/&quot;/g, '').replace(/"/g, '');
  if (res.includes(',')) {
    return res.split(',')?.[0]?.trim();
  }
};

export const getFontFamilyFromObjectStyle = (styles: ObjectStyle<string>, onlyHans = true, styleCamelCase = false) => {
  if (!styles || typeof styles !== 'object') return {};
  const keys = Object.keys(styles).filter((ele) => ele.includes(styleCamelCase ? 'ontFamily' : 'font-family'));
  if (!keys.length) return {};
  const values = keys.map((ele) => styles[ele] as string);
  let font: string;
  let fonts: WordXmlFonts;
  if (keys.includes(styleCamelCase ? 'fontFamily' : 'font-family')) {
    font = styles[styleCamelCase ? 'fontFamily' : 'font-family'] as string;
  } else {
    const hans = values.find((ele) => isAllChineseWord(ele));
    if (onlyHans) {
      font = hans;
    }
  }
  // 'mso-hansi-font-family', 'mso-ascii-font-family', 'mso-bidi-font-family', 'mso-fareast-font-family'
  const hansi = styleCamelCase ? 'msoHansiFontFamily' : 'mso-hansi-font-family';
  const ascii = styleCamelCase ? 'msoAsciiFontFamily' : 'mso-ascii-font-family';
  const eastAsia = styleCamelCase ? 'msoFareastFontFamily' : 'mso-fareast-font-family';
  const bidi = styleCamelCase ? 'msoBidiFontFamily' : 'mso-bidi-font-family';
  if (styles[hansi]) {
    fonts = { ...(fonts || {}), hAnsiFont: fontStringTrans(styles[hansi]) };
  }
  if (styles[ascii]) {
    fonts = { ...(fonts || {}), asciiFont: fontStringTrans(styles[ascii]) };
  }
  if (styles[eastAsia]) {
    fonts = { ...(fonts || {}), eastAsiaFont: fontStringTrans(styles[eastAsia]) };
  }
  if (styles[bidi]) {
    fonts = { ...(fonts || {}), csFont: fontStringTrans(styles[bidi]) };
  }
  if (font) {
    font = fontStringTrans(font);
  }
  return {
    fontFamily: font,
    fonts,
  };
};

export const getLangFromObjectStyle = (styles: ObjectStyle = {}, styleCamelCase = false) => {
  if (!styles || typeof styles !== 'object') return {};
  let lang: string;
  let bidiLang: string;
  const langName = styleCamelCase ? 'msoLanguage' : 'mso-language';
  const bidiLangName = styleCamelCase ? 'msoBidiLanguage' : 'mso-bidi-language';
  if (styles[langName]) lang = `${styles[langName]}`.toLowerCase();
  if (styles[bidiLangName]) bidiLang = `${styles[bidiLang]}`.toLowerCase();
  return {
    lang, bidiLang,
  };
};
