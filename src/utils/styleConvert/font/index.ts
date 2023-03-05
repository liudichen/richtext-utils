import { isAllChineseWord, type ObjectStyle } from '@iimm/shared';

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

export const getFontFamilyFromObjectStyle = (styles: ObjectStyle, onlyHans = true, styleCamelCase = false) => {
  if (!styles || typeof styles !== 'object') return;
  const keys = Object.keys(styles).filter((ele) => ele.includes(styleCamelCase ? 'ontFamily' : 'font-family'));
  if (!keys.length) return;
  const values = keys.map((ele) => styles[ele] as string);
  let font;
  if (keys.includes(styleCamelCase ? 'fontFamily' : 'font-family')) {
    font = styles[styleCamelCase ? 'fontFamily' : 'font-family'];
  } else {
    const hans = values.find((ele) => isAllChineseWord(ele));
    if (onlyHans) {
      font = hans;
    } else {
      font = values[0];
    }
  }
  if (font) {
    font = font.replace(/&quot;/g, '').replace(/"/g, '');
    if (font.includes(',')) return font.split(',')[0];
    return font;
  }
};
