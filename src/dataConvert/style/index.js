/* eslint-disable no-constant-condition */
/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-26 11:00:03
 * @LastEditTime: 2022-10-27 00:08:11
 */

import { isAllChineseWord } from '../../judge';
import { htmlColorToWordColor } from '../color';

// // html的line-height转化为word中的行距(行高)
// export const lineHeightHtmlToWordLineNumber = (lineHeight) => {
//   if (!lineHeight || typeof lineHeight !== 'string' || /^[\d.]+(%|pt)$/.test(lineHeight)) return;
//   if (lineHeight.endsWith('pt')) {
//     const number = +lineHeight.slice(0, lineHeight.length - 2);
//     if (isNaN(number)) return;
//     return Math.round(number * 20);
//   }
//   const number = +lineHeight.slice(0, lineHeight.length - 1);
//   if (isNaN(number)) return;
//   return Math.round(number * 24);
// };

// eslint-disable-next-line jsdoc/require-param
/** html style 转 word xml属性
 * mso-para-margin-top： w:beforeLines
 * mso-para-margin-bottom： w:afterLines
 * mso-para-margin-right： gd-> w:ind-w:rightChars cm/pt -> w:ind-w:right
 * mso-para-margin-left: gd-> w:ind-w:leftChars cm/pt -> w:ind-w:left
 * line-height： /w:line
 * text-indent负数时：w:ind-w:hanging,
 * text-indent:正数  w:ind-w:firstLine
 * mso-char-indent-count: w:ind-w:firstLineChars
 * **/
export const lineAttributesHtmlToWordLineInfoNumber = (margin) => {
  if (!margin) return;
  if (typeof margin === 'number') margin = `${margin * 3 / 4}pt`;
  if (typeof margin !== 'string') return;
  if (margin.endsWith('px')) {
    margin = +(margin.slice(0, margin.length - 2).trim());
    if (!margin) return;
    margin = `${margin * 3 / 4}pt`;
  }
  if (!/^-?[\d.]+(cm|gd|pt|%)$/.test(margin)) return;
  if (margin.endsWith('%')) {
    const number = +margin.slice(0, margin.length - 1);
    if (isNaN(number)) return;
    return Math.round(number * 240 / 100);
  }
  const number = +margin.slice(0, margin.length - 2);
  if (isNaN(number)) return;
  if (margin.endsWith('cm')) {
    return Math.round(number * 567);
  }
  if (margin.endsWith('pt')) {
    if (number < 1) return;
    return Math.round(number * 20);
  }
  // gd
  return Math.round(number * 100);
};

// 上 右 下 左
export const splitMargin = (margin) => {
  if (!margin || typeof margin !== 'string') return [];
  margin = margin.split(/[\s]+/);
  if (margin.length > 4 || margin.length === 0) return [];
  if (margin.length === 4) return margin;
  if (margin.length === 2) return [ margin[0], margin[1], [ margin[0], margin[1] ]];
  if (margin.length === 1) return [ margin[0], margin[0], margin[0], margin[0] ];
  return [ ...margin, margin[1] ];
};

export const ParagraphRelateStyleKeys = [
  'line-height', 'line-height-rule',
  'margin',
  'mso-para-margin-top', 'margin-top',
  'mso-para-margin-bottom', 'margin-bottom',
  'mso-para-margin-right', 'mso-para-margin-left',
  'text-indent',
  'mso-char-indent-count',
  'font-family', 'mso-hansi-font-family', 'mso-ascii-font-family', 'mso-bidi-font-family', 'mso-fareast-font-family',
  'font-size',
  'text-align', 'text-justify', 'text-align-last',
  'mso-list', // 实际标签是li
];

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
  return Math.random(number || 0);
};

export const getFontFamily = (styles) => {
  if (!styles || typeof styles !== 'object') return;
  const keys = Object.keys(styles).filter((ele) => ele.includes('font-family'));
  if (!keys.length) return;
  const values = keys.map((ele) => styles[ele]);
  if (keys.includes('font-family')) return styles['font-family'];
  //  暂时仅保留汉语字体
  return values.find((ele) => isAllChineseWord(ele));
};

// w:pPr [w:spacing, w:ind, w:jc, w:rPr [w:rFonts, w:sz,w:szCs]]
export const getParagraphParams = (styles) => {
  const data = { type: 'p' };
  const keys = Object.keys(styles || {});
  if (!keys.length) return data;
  if (styles?.pStyle) data.pStyle = styles.pStyle;
  // === w:pPr -> w:spacing ======
  if (true) {
    if (keys.includes('line-height')) {
      data.line = lineAttributesHtmlToWordLineInfoNumber(styles['line-height']);
      if (styles['line-height-rule'] === 'exactly') data.lineRuleExact = true;
    }
    if (keys.includes('mso-para-margin-top')) {
      data.beforeLines = lineAttributesHtmlToWordLineInfoNumber(styles['mso-para-margin-top']);
    }
    if (keys.includes('margin-top')) {
      data.before = lineAttributesHtmlToWordLineInfoNumber(styles['margin-top']);
    }
    if (keys.includes('mso-para-margin-bottom')) {
      data.afterLines = lineAttributesHtmlToWordLineInfoNumber(styles['mso-para-margin-bottom']);
    }
    if (keys.includes('margin-bottom')) {
      data.after = lineAttributesHtmlToWordLineInfoNumber(styles['margin-bottom']);
    }
  }
  // ====================

  // ===== w:pPr -> w:ind =====
  if (true) {
  // eslint-disable-next-line no-unused-vars
    const [ t, r, b, l ] = splitMargin(styles.margin).map(lineAttributesHtmlToWordLineInfoNumber);
    if (keys.includes('mso-para-margin-left')) {
      const value = styles['mso-para-margin-left'];
      const wordValue = lineAttributesHtmlToWordLineInfoNumber(value);
      if (value?.endsWith('gd')) {
        data.leftChars = wordValue;
        if (!keys.includes('margin-left') && !l) {
          data.left = Math.round(wordValue / 100 * 210);
        }
      } else {
        data.left = wordValue;
      }
    }
    if (keys.includes('margin-left')) {
      data.left = lineAttributesHtmlToWordLineInfoNumber(styles['margin-left']);
    } else if (l) {
      data.left = l;
    }
    if (keys.includes('mso-para-margin-right')) {
      const value = styles['mso-para-margin-right'];
      const wordValue = lineAttributesHtmlToWordLineInfoNumber(value);
      if (value?.endsWith('gd')) {
        data.rightChars = wordValue;
        if (!keys.includes('margin-right') && !r) {
          data.right = Math.round(wordValue / 100 * 210);
        }
      } else {
        data.right = wordValue;
      }
    }
    if (keys.includes('margin-right')) {
      data.right = lineAttributesHtmlToWordLineInfoNumber(styles['margin-right']);
    } else if (r) {
      data.left = r;
    }
    if (keys.includes('text-indent')) {
      const value = styles['text-indent'];
      const wordValue = lineAttributesHtmlToWordLineInfoNumber(value);
      if (wordValue) {
        if (value.endsWith('gd')) {
          if (wordValue > 0) {
            data.firstLineChars = wordValue;
            data.firstLine = Math.round(wordValue / 100 * 210);
          } else {
            data.hangingChars = -wordValue;
            data.hanging = Math.round(wordValue / 100 * -210);
          }
        } else {
          if (wordValue > 0) {
            data.firstLine = wordValue;
          } else {
            data.hanging = -wordValue;
          }
        }
      }
    }
    if (keys.includes('mso-char-indent-count')) {
      const value = +styles['mso-char-indent-count'];
      if (value > 0) {
        data.firstLineChars = value * 100;
        if (typeof data.firstLine === 'undefined') data.firstLine = Math.round(value * 210);
      } else if (value < 0) {
        data.hangingChars = Math.round(value * -100);
        if (typeof data.hanging === 'undefined') data.hanging = Math.round(value * -210);
      }
    }
  }
  // ========================
  // ====== w:pPr -> w:jc
  if (true) {
    if (keys.includes('text-align')) {
      const align = styles['text-algin'];
      if (align === 'right' || align === 'center' || align === 'left') {
        data.align = align;
      } else if (align === 'justify' && (styles['text-align-last'] === 'justify' || styles['text-justify'] === 'distribute-all-lines')) {
        data.align = 'distribute';
      }
    }
  }
  // ===============
  // ===== w:pPr -> w:rPr -> w:sz/w:szCs
  if (keys.includes('font-size')) {
    data.fontSize = htmlFontSizeToWordFontSizeNumber(styles['font-size']);
  }
  // ============================

  // ========== w:pPr -> w:rPr -> w:rFonts 暂时仅保留汉语字体
  data.fontFamily = getFontFamily(styles);
  return data;
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

