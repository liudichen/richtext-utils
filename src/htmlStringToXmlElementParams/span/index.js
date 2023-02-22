/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 09:43:15
 * @LastEditTime: 2022-11-08 22:48:04
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';
import { getFontFamilyFromHtmlStyleObj, htmlColorToWordColor, htmlFontSizeToWordFontSizeNumber } from '../../htmlStyleConvertToWordAttributes';
import { imageHtmlJsonNodeParser } from '../image';
import { getParagraphElementParamsFormStyles } from '../paragraph';

export const getTextElementParamsFromStyles = (styles) => {
  const data = {};
  const keys = Object.keys(styles || {});
  if (!keys.length) return {};
  data.fontFamily = getFontFamilyFromHtmlStyleObj(styles);
  // w:kern
  if (keys.includes('mso-font-kerning')) {
    let kern = styles['mso-font-kerning'];
    if (typeof kern === 'string' && kern.endsWith('pt')) {
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
  if (styles.border) {
    data.border = true;
    const arr = styles.border.split(/[\w]+/);
    const color = arr[arr.length - 1];
    if (color !== 'windowtext') {
      data.borderColor = htmlColorToWordColor(color);
    }
  }
  data.text = (styles.text || '').replace(/&nbsp;/g, ' ');
  return data;
};

export const spanHtmlJsonNodeParser = async (node, specailStyles = {}, parentStyles = {}, result = [], config, getImageStepTwoParamsFn, paragraghParams) => {
  const { NODENAME, TEXTTAG, TEXTVALUE, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, config);
  const { [NODENAME]: tagName, type, [STYLE]: style = {}, [TEXTVALUE]: text, [CHILDREN]: children } = node;
  if (type === TEXTTAG) {
    const textParams = getTextElementParamsFromStyles({ ...parentStyles, ...specailStyles, ...style, text });
    result.push({ type: 'text', ...textParams });
  } else if ([ 'b', 'strong', 'em', 'i', 'u', 's', 'sub', 'sup' ].includes(tagName) || style.border) {
    const newSpecialStyles = { ...specailStyles };
    if (tagName === 'b' || tagName === 'strong') {
      newSpecialStyles.bold = true;
    } else if (tagName === 'em' || tagName === 'i') {
      newSpecialStyles.italic = true;
    } else if (tagName === 'u') {
      newSpecialStyles.underline = true;
    } else if (tagName === 's') {
      newSpecialStyles.strike = true;
    } else if (tagName === 'sub') {
      newSpecialStyles.sub = true;
    } else if (tagName === 'sup') {
      newSpecialStyles.sup = true;
    }
    if (style.border) {
      newSpecialStyles.border = style.border;
    }
    for (let i = 0; i < children?.length; i++) {
      const ele = children[i];
      await spanHtmlJsonNodeParser(ele, newSpecialStyles, { ...parentStyles, ...style }, result, config, getImageStepTwoParamsFn);
    }
  } else if (tagName === 'span') {
    if (paragraghParams) {
      const pStyle = getParagraphElementParamsFormStyles(style);
      const keys = Object.keys(pStyle);
      if (keys.length > 1) {
        for (let k = 0; k < keys.length; k++) {
          const attr = keys[k];
          if (attr !== 'p' && !paragraghParams[attr]) {
            paragraghParams[attr] = pStyle[attr];
          }
        }
      }
    }
    for (let i = 0; i < children?.length; i++) {
      const ele = children[i];
      await spanHtmlJsonNodeParser(ele, { ...specailStyles }, { ...parentStyles, ...style }, result, config, getImageStepTwoParamsFn);
    }
  } else if (tagName === 'img') {
    const res = await imageHtmlJsonNodeParser(node, config, getImageStepTwoParamsFn);
    result.push(res);
  }
};
