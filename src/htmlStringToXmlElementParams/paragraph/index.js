import { htmlSpacingSizeToWordSizeNumber, splitHtmlMarginString, htmlFontSizeToWordFontSizeNumber, getFontFamlyFromHtmlStyleObj } from '../../htmlStyleConvertToWordAttributes';
import { DefaultNodeStructOptions } from '../../JsonAndHtml';
import { spanHtmlJsonNodeParser } from '../span';
import { imageHtmlJsonNodeParser } from '../image';

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
export const getParagraphElementParamsFormStyles = (styles) => {
  const data = { type: 'p' };
  const keys = Object.keys(styles || {});
  if (!keys.length) return data;
  if (styles?.pStyle) data.pStyle = styles.pStyle;
  // === w:pPr -> w:spacing ======
  if (keys.includes('line-height')) {
    data.line = htmlSpacingSizeToWordSizeNumber(styles['line-height']);
    if (styles['line-height-rule'] === 'exactly') data.lineRuleExact = true;
  }
  if (keys.includes('mso-para-margin-top')) {
    data.beforeLines = htmlSpacingSizeToWordSizeNumber(styles['mso-para-margin-top']);
  }
  if (keys.includes('margin-top')) {
    data.before = htmlSpacingSizeToWordSizeNumber(styles['margin-top']);
  }
  if (keys.includes('mso-para-margin-bottom')) {
    data.afterLines = htmlSpacingSizeToWordSizeNumber(styles['mso-para-margin-bottom']);
  }
  if (keys.includes('margin-bottom')) {
    data.after = htmlSpacingSizeToWordSizeNumber(styles['margin-bottom']);
  }
  // ====================

  // ===== w:pPr -> w:ind =====
  // eslint-disable-next-line no-unused-vars
  const [ t, r, b, l ] = splitHtmlMarginString(styles.margin).map(htmlSpacingSizeToWordSizeNumber);
  if (keys.includes('mso-para-margin-left')) {
    const value = styles['mso-para-margin-left'];
    const wordValue = htmlSpacingSizeToWordSizeNumber(value);
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
    data.left = htmlSpacingSizeToWordSizeNumber(styles['margin-left']);
  } else if (l) {
    data.left = l;
  }
  if (keys.includes('mso-para-margin-right')) {
    const value = styles['mso-para-margin-right'];
    const wordValue = htmlSpacingSizeToWordSizeNumber(value);
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
    data.right = htmlSpacingSizeToWordSizeNumber(styles['margin-right']);
  } else if (r) {
    data.left = r;
  }
  if (keys.includes('text-indent')) {
    const value = styles['text-indent'];
    const wordValue = htmlSpacingSizeToWordSizeNumber(value);
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
    const align = styles['text-align'];
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
  data.fontFamily = getFontFamlyFromHtmlStyleObj(styles);
  return data;
};

export const paragraphHtmlJsonNodeParser = async (node, config, getImageStepTwoParamsFn) => {
  const { NODENAME, TEXTTAG, TEXTVALUE, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, config);
  const { [CHILDREN]: children, [STYLE]: style = {} } = node;
  const data = [];
  let imgFirst = true;
  const paragraphParams = getParagraphElementParamsFormStyles(style);
  let items = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const { [NODENAME]: tagName, type, [TEXTVALUE]: text } = child;
    if (type === TEXTTAG) {
      items.push({ type, text });
      if (!data.length) imgFirst = false;
    }
    if (tagName === 'span') {
      const result = [];
      await spanHtmlJsonNodeParser(child, {}, {}, result, config, getImageStepTwoParamsFn);
      console.log('outResult', result);
      items.push(...result);
      if (!data.length) imgFirst = false;
    } else if (tagName === 'img') { // 内联图片可以任务是p的子元素
      const imgNode = await imageHtmlJsonNodeParser(child, config, getImageStepTwoParamsFn);
      if (imgNode) { items.push(imgNode); }
    }
  }
  // 清除没有文本内容的 text子项
  items = items.filter((ele) => ele.type !== TEXTTAG || ele[TEXTVALUE] !== '');
  if (imgFirst || !data.length) {
    data.push({ ...paragraphParams, items });
  } else {
    data.unshift({ ...paragraphParams, items });
  }
  return data;
};
