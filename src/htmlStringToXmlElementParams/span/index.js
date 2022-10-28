/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 09:43:15
 * @LastEditTime: 2022-10-28 10:18:44
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';
import { getFontFamlyFromHtmlStyleObj, htmlColorToWordColor, htmlFontSizeToWordFontSizeNumber } from '../../htmlStyleConvertToWordAttributes';
import { imageHtmlJsonNodeParser } from '../image';

export const getTextElementParamsFromStyles = (styles) => {
  const data = {};
  const keys = Object.keys(styles || {});
  if (!keys.length) return {};
  data.fontFamily = getFontFamlyFromHtmlStyleObj(styles);
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

export const spanHtmlJsonNodeParser = (node, specailStyles = {}, parentStyles = {}, result = [], config) => {
  const { NODENAME, TEXTTAG, TEXTVALUE, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, config);
  const { [NODENAME]: tagName, type, [STYLE]: style, [TEXTVALUE]: text, [CHILDREN]: children } = node;
  if (type === TEXTTAG) {
    const textParams = getTextElementParamsFromStyles({ ...parentStyles, ...specailStyles });
    result.push({ type: 'text', text, ...textParams });
  } else if ([ 'b', 'strong', 'em', 'i', 'u', 's', 'sub', 'sup' ].includes(tagName)) {
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
    children.forEach((ele) => spanHtmlJsonNodeParser(ele, newSpecialStyles, { ...parentStyles }, result, config));
  } else if (tagName === 'span') {
    children.forEach((ele) => spanHtmlJsonNodeParser(ele, { ...specailStyles }, { ...style }, result, config));
  } else if (tagName === 'img') {
    result.push(imageHtmlJsonNodeParser(node, config));
  }
};
