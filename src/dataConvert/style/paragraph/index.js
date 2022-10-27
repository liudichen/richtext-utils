/* eslint-disable jsdoc/require-param */

import { getFontFamily, htmlFontSizeToWordFontSizeNumber } from '../text';

/** html style的段落间距相关的尺寸大小转 word xml属性的数值大小
 * mso-para-margin-top： w:beforeLines
 * mso-para-margin-bottom： w:afterLines
 * mso-para-margin-right： gd-> w:ind-w:rightChars cm/pt -> w:ind-w:right
 * mso-para-margin-left: gd-> w:ind-w:leftChars cm/pt -> w:ind-w:left
 * line-height： /w:line
 * text-indent负数时：w:ind-w:hanging,
 * text-indent:正数  w:ind-w:firstLine
 * mso-char-indent-count: w:ind-w:firstLineChars
 * **/
export const htmlParagraphSizeToWordSizeNumber = (size) => {
  if (!size) return;
  if (typeof margin === 'number') size = `${size * 3 / 4}pt`;
  if (typeof size !== 'string') return;
  if (size.endsWith('px')) {
    size = +(size.slice(0, size.length - 2).trim());
    if (!size) return;
    size = `${size * 3 / 4}pt`;
  }
  if (!/^-?[\d.]+(cm|gd|pt|%)$/.test(size)) return;
  if (size.endsWith('%')) {
    const number = +size.slice(0, size.length - 1);
    if (isNaN(number)) return;
    return Math.round(number * 240 / 100);
  }
  const number = +size.slice(0, size.length - 2);
  if (isNaN(number)) return;
  if (size.endsWith('cm')) {
    return Math.round(number * 567);
  }
  if (size.endsWith('pt')) {
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
  if (margin.length === 0) return [];
  if (margin.length >= 4) return margin.slice(0, 4);
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


// w:pPr [w:spacing, w:ind, w:jc, w:rPr [w:rFonts, w:sz,w:szCs]]
export const getParagraphParams = (styles) => {
  const data = { type: 'p' };
  const keys = Object.keys(styles || {});
  if (!keys.length) return data;
  if (styles?.pStyle) data.pStyle = styles.pStyle;
  // === w:pPr -> w:spacing ======
  if (keys.includes('line-height')) {
    data.line = htmlParagraphSizeToWordSizeNumber(styles['line-height']);
    if (styles['line-height-rule'] === 'exactly') data.lineRuleExact = true;
  }
  if (keys.includes('mso-para-margin-top')) {
    data.beforeLines = htmlParagraphSizeToWordSizeNumber(styles['mso-para-margin-top']);
  }
  if (keys.includes('margin-top')) {
    data.before = htmlParagraphSizeToWordSizeNumber(styles['margin-top']);
  }
  if (keys.includes('mso-para-margin-bottom')) {
    data.afterLines = htmlParagraphSizeToWordSizeNumber(styles['mso-para-margin-bottom']);
  }
  if (keys.includes('margin-bottom')) {
    data.after = htmlParagraphSizeToWordSizeNumber(styles['margin-bottom']);
  }
  // ====================

  // ===== w:pPr -> w:ind =====
  // eslint-disable-next-line no-unused-vars
  const [ t, r, b, l ] = splitMargin(styles.margin).map(htmlParagraphSizeToWordSizeNumber);
  if (keys.includes('mso-para-margin-left')) {
    const value = styles['mso-para-margin-left'];
    const wordValue = htmlParagraphSizeToWordSizeNumber(value);
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
    data.left = htmlParagraphSizeToWordSizeNumber(styles['margin-left']);
  } else if (l) {
    data.left = l;
  }
  if (keys.includes('mso-para-margin-right')) {
    const value = styles['mso-para-margin-right'];
    const wordValue = htmlParagraphSizeToWordSizeNumber(value);
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
    data.right = htmlParagraphSizeToWordSizeNumber(styles['margin-right']);
  } else if (r) {
    data.left = r;
  }
  if (keys.includes('text-indent')) {
    const value = styles['text-indent'];
    const wordValue = htmlParagraphSizeToWordSizeNumber(value);
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
  // ========================
  // ====== w:pPr -> w:jc
  if (keys.includes('text-align')) {
    const align = styles['text-algin'];
    if (align === 'right' || align === 'center' || align === 'left') {
      data.align = align;
    } else if (align === 'justify' && (styles['text-align-last'] === 'justify' || styles['text-justify'] === 'distribute-all-lines')) {
      data.align = 'distribute';
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
