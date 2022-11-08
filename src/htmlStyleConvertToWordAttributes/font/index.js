/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 09:35:05
 * @LastEditTime: 2022-11-08 22:47:34
 */
import { isAllChineseWord } from '../../judgeAndCompare';

export const getFontFamilyFromHtmlStyleObj = (styles, onlyHans = true) => {
  if (!styles || typeof styles !== 'object') return;
  const keys = Object.keys(styles).filter((ele) => ele.includes('font-family'));
  if (!keys.length) return;
  const values = keys.map((ele) => styles[ele]);
  let font;
  if (keys.includes('font-family')) {
    font = styles['font-family'];
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

export const htmlFontSizeToWordFontSizeNumber = (fontSize) => {
  let type = '';
  let number = 0;
  if (typeof fontSize === 'number') {
    type = 'px'; number = fontSize;
  } else if (typeof fontSize === 'string' && /^[\d.]+(pt|px)$/.test(fontSize)) {
    type = fontSize.slice(-2);
    number = +fontSize.slice(0, fontSize.length - 2);
    if (!isNaN) {
      type = fontSize.slice(-2);
    }
  }
  if (type === 'px') number = number * 3 / 4;
  if (type) number = number * 2;
  return Math.round(number || 0);
};
