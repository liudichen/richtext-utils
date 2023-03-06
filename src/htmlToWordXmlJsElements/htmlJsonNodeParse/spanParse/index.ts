import { type HtmlJsonNode, camelCase } from '@iimm/shared';
import type { HtmlJsonNodeParserOptions, GetImageStepTwoParamsFn, SpanSpecialStyles, HtmlXmlParamsTextNode, HtmlXmlParamsParagrapNode } from '@/types/index';
import { htmlColorToWordColor, getFontFamilyFromObjectStyle, htmlFontSizeToWordFontSizeNumber, getLangFromObjectStyle } from '@/utils/index';

import { getParagraphParamsFromStyle } from '../paragrahParse';
import { imageHtmlJsonNodeParser } from '../imageParse';

/** word里的文本下划线样式 */
export const WordUnderlineStyle = [ 'single', 'double', 'thick', 'dotted', 'dash', 'dashed', 'dot-dash', 'dot-dot-dash', 'wave', 'wavy-heavy', 'wavy-double' ];

export const getTextParamsFromStyles = (styles: any, onlyHans = true, styleCamelCase = false) => {
  const data: HtmlXmlParamsTextNode = {};
  const keys = Object.keys(styles || {});
  if (!keys.length) return {};
  const { fontFamily, fonts } = getFontFamilyFromObjectStyle(styles, onlyHans, styleCamelCase);
  if (fontFamily) data.fontFamily = fontFamily;
  if (fonts) data.fonts = fonts;
  // w:kern
  const mKernStr = styleCamelCase ? 'msoFontKerning' : 'mso-font-kerning';
  if (keys.includes(mKernStr)) {
    let kern = styles[mKernStr];
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
  const fsStr = styleCamelCase ? 'fontSize' : 'font-size';
  if (styles[fsStr]) {
    data.fontSize = htmlFontSizeToWordFontSizeNumber(styles[fsStr]);
  }
  const bgColorStr = styleCamelCase ? 'backgroundColor' : 'background-color';
  if (styles[bgColorStr]) {
    data.backgroundColor = htmlColorToWordColor(styles[bgColorStr]);
  }
  if (styles.underline) {
    data.underline = styles.underline;
    data.underlineColor = styles.underlineColor;
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
  const { lang, bidiLang } = getLangFromObjectStyle(styles, styleCamelCase);
  if (lang) data.lang = lang;
  if (bidiLang) data.bidiLang = bidiLang;
  return data;
};
/**
 * 解析span节点(或li节点)及其下面的内容
 * @param node HmtlJosonNode参数节点
 * @param specailStyles 从上层span传递下来的诸如加粗/斜体等格式
 * @param parentStyles 从段落传递下来的默认字体和字号格式
 * @param result 存放解析后结果
 * @param getImageStepTwoParamsFn 处理图片的step2函数
 * @param paragraghParams 由于li本身没有styLe导致没有段落格式，在父节点为li时，传递解析的空参数表下来以从第1各子节点获取段落格式
 * @param options 解析配置
 */
export const spanHtmlJsonNodeParser = async (node: HtmlJsonNode, specailStyles: SpanSpecialStyles = {}, parentStyles: Partial<HtmlXmlParamsTextNode> = {}, result = [], getImageStepTwoParamsFn?: GetImageStepTwoParamsFn, paragraghParams?: HtmlXmlParamsParagrapNode, options?: HtmlJsonNodeParserOptions) => {
  const { NODENAME = 'name', TEXTTAG = 'text', TEXTVALUE = 'text', CHILDREN = 'elements', STYLE = 'style', onlyHans = true, styleCamelCase = false } = options || {};
  const { [NODENAME]: tagName, type, [STYLE]: style = {}, [TEXTVALUE]: text, [CHILDREN]: children } = node;
  const textParams = { ...(parentStyles || {}), ...getTextParamsFromStyles({ ...specailStyles, ...style, text }, onlyHans, styleCamelCase) };
  const tPStyle: Partial<HtmlXmlParamsTextNode> = {};
  if (textParams.fontFamily) tPStyle.fontFamily = textParams.fontFamily;
  if (textParams.fontSize) tPStyle.fontSize = textParams.fontSize;
  if (textParams.color) tPStyle.color = textParams.color;
  if (type === TEXTTAG) {
    result.push({ type: 'text', ...textParams });
  } else if ([ 'b', 'strong', 'em', 'i', 'u', 's', 'sub', 'sup' ].includes(tagName) || style.border) {
    const newSpecialStyles: SpanSpecialStyles = { ...specailStyles };
    if (tagName === 'b' || tagName === 'strong') {
      newSpecialStyles.bold = true;
    } else if (tagName === 'em' || tagName === 'i') {
      newSpecialStyles.italic = true;
    } else if (tagName === 'u') {
      const underlineString = style?.[styleCamelCase ? 'textUnderline' : 'text-underline'] ?? style?.textUnderline;
      let underline = 'single';
      let underlineColor = null;
      if (underlineString) {
        if (underlineString.includes(' ')) {
          const arr = underline.split('');
          underline = arr[arr.length - 1];
          underlineColor = htmlColorToWordColor(arr[0]);
        } else {
          if (WordUnderlineStyle.includes(underlineString)) {
            underline = camelCase(underlineString);
          } else {
            underlineColor = htmlColorToWordColor(underlineString);
          }
        }
      }
      newSpecialStyles.underline = underline;
      newSpecialStyles.underlineColor = underlineColor;
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
      await spanHtmlJsonNodeParser(ele, newSpecialStyles, tPStyle, result, getImageStepTwoParamsFn, undefined, options);
    }
  } else if (tagName === 'span') {
    /** 从li的第1层span子节点，获得li的段落格式 */
    if (paragraghParams) {
      const pStyle = getParagraphParamsFromStyle(style, onlyHans, styleCamelCase);
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
      await spanHtmlJsonNodeParser(ele, { ...specailStyles }, tPStyle, result, getImageStepTwoParamsFn, undefined, options);
    }
  } else if (tagName === 'img') {
    const res = await imageHtmlJsonNodeParser(node, getImageStepTwoParamsFn, options);
    result.push(res);
  }
};
