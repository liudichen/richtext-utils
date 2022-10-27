/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:34:58
 * @LastEditTime: 2022-10-27 22:36:47
 */

import { isAllChineseWord } from '../../../judge';
import { htmlColorToWordColor } from '../../../dataConvert';

export const getFontFamily = (styles, onlyHans = true) => {
  if (!styles || typeof styles !== 'object') return;
  const keys = Object.keys(styles).filter((ele) => ele.includes('font-family'));
  if (!keys.length) return;
  const values = keys.map((ele) => styles[ele]);
  if (keys.includes('font-family')) return styles['font-family'];
  const hans = values.find((ele) => isAllChineseWord(ele));
  if (onlyHans) return hans;
  return hans || values[0];
};

export const htmlFontSizeToWordFontSizeNumber = (fontSize) => {
  let type = '';
  let number = 0;
  if (typeof fontSize === 'number') {
    type = 'px'; number = fontSize;
  } else if (typeof fontSize === 'string' && /^[\d.]+(pt|px)$/.test(fontSize)) {
    number = +fontSize.slice(0, fontSize.length - 2);
    if (!isNaN) {
      type = fontSize.slice(-2);
    }
  }
  if (type === 'px') number = number * 3 / 4;
  if (type) number = number * 2;
  return Math.round(number || 0);
};

// w:r [w:rPr [w:rFonts w:kern w:b w:bCs w:i w:iCs w:strike w:color w:sz w:szCs w:hightlight w:u w:verAlign] w:t ]
export const getTextParams = (styles) => {
  const data = {};
  const keys = Object.keys(styles || {});
  if (!keys.length) return {};
  data.fontFamily = getFontFamily(styles);
  // w:kern
  if (keys.includes('mso-font-kerning')) {
    let kern = styles['mso-font-kerning'];
    if (kern && kern?.endsWith('pt')) {
      kern = +(kern.slice(0, kern.length - 2).trim());
      if (kern) data.kern = kern * 2;
    }
  }
  if (styles.bold === true) {
    data.bold = true;
  }
  if (styles.italic === true) {
    data.italic = true;
  }
  if (styles.strike === true) {
    data.strike = true;
  }
  if (styles.color) {
    data.color = htmlColorToWordColor(styles.color);
  }
  if (styles['font-size']) {
    data.fontSize = htmlFontSizeToWordFontSizeNumber(styles['font-size']);
  }
  if (styles['background-color']) {
    data.backgroundColor = htmlColorToWordColor(styles['background-color']);
  }
  if (styles.underline === true) {
    data.underline = true;
  }
  if (styles.sub === true) {
    data.sub = true;
  } else if (styles.sup === true) {
    data.sup = true;
  }
  data.text = (styles.text || '').replace(/&nbsp;/g, ' ');
  return data;
};
