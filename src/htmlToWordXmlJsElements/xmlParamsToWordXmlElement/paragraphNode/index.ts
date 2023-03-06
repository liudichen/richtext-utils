import type { XmlElementGenerationConfig, XmlNode, HtmlXmlParamsImageNode, HtmlXmlParamsParagrapNode, HtmlXmlParamsTextNode } from '@/types/index';

import { textXmlParamsNodeToXmlElementObj } from '../textNode';
import { imageXmlParamsNodeToXmlElementObj } from '../imageNode';

/**
 * 解析并转换后的段落的xml参数节点转换为xml的js对象
 */
export const paragraphXmlParamsNodeToXmlElementObj = (paragraphNode: HtmlXmlParamsParagrapNode, config?: XmlElementGenerationConfig) => {
  let {
    line, lineRuleExact,
    before, beforeLines,
    after, afterLines,
    left, leftChars,
    right, rightChars,
    firstLine, firstLineChars,
    hanging, hangingChars,
    align,
    fontFamily, fontSize, fonts,
    lang, bidiLang,
    color, kern,
    pStyle,
    listLvl, listNumId,
    items,
  } = paragraphNode;
  const { defaultFontFamily = '宋体', defaultFontSize = 24 } = config || {};
  const { asciiFont, hAnsiFont, eastAsiaFont, csFont } = fonts || {};
  if (!fontSize) fontSize = defaultFontSize;
  if (!fontFamily) fontFamily = defaultFontFamily;
  let w_pStyle = null;
  if (pStyle) {
    w_pStyle = {
      type: 'element',
      name: 'w:pStyle',
      attributes: { 'w:val': `${pStyle}` },
      elements: [],
    };
  }
  let w_spacing = null;
  if (line || before || after) {
    w_spacing = {
      type: 'element',
      name: 'w:spacing',
      attributes: { },
      elements: [],
    };
    if (line) w_spacing.attributes['w:line'] = `${line}`;
    if (before) w_spacing.attributes['w:before'] = `${before}`;
    if (beforeLines)w_spacing.attributes['w:beforeLines'] = `${beforeLines}`;
    if (after)w_spacing.attributes['w:after'] = `${after}`;
    if (afterLines) w_spacing.attributes['w:afterLines'] = `${afterLines}`;
    if (lineRuleExact)w_spacing.attributes['w:lineRule'] = 'exact';
  }
  let w_ind = null;
  if (left || right || leftChars || rightChars || firstLine || hanging) {
    w_ind = {
      type: 'element',
      name: 'w:ind',
      attributes: {},
      elements: [],
    };
    if (left) w_ind.attributes['w:left'] = `${left}`;
    if (leftChars) w_ind.attributes['w:leftChars'] = `${leftChars}`;
    if (right) w_ind.attributes['w:right'] = `${right}`;
    if (rightChars) w_ind.attributes['w:rightChars'] = `${rightChars}`;
    if (firstLine) w_ind.attributes['w:firstLine'] = `${firstLine}`;
    if (firstLineChars) w_ind.attributes['w:firstLineChars'] = `${firstLineChars}`;
    if (hanging) w_ind.attributes['w:hanging'] = `${hanging}`;
    if (hangingChars) w_ind.attributes['w:hangingChars'] = `${hangingChars}`;
  }
  let w_jc = null;
  if (align) {
    w_jc = { type: 'element',
      name: 'w:jc',
      attributes: {
        'w:val': align,
      },
      elements: [] };
  }
  let w_rFonts = null;
  if (fontFamily || asciiFont || hAnsiFont || eastAsiaFont || csFont) {
    w_rFonts = {
      type: 'element',
      name: 'w:rFonts',
      attributes: { 'w:hint': 'eastAsia' },
      elements: [],
    };
    if (asciiFont || hAnsiFont || eastAsiaFont || csFont) {
      if (asciiFont) w_rFonts.attributes['w:ascii'] = asciiFont;
      if (hAnsiFont) w_rFonts.attributes['w:hAnsi'] = hAnsiFont;
      if (eastAsiaFont) w_rFonts.attributes['w:eastAsia'] = eastAsiaFont;
      if (csFont) w_rFonts.attributes['w:cs'] = csFont;
    } else {
      w_rFonts.attributes = { 'w:hAnsi': fontFamily, 'w:ascii': fontFamily, 'w:eastAsia': fontFamily, 'w:hint': 'eastAsia' };
    }
  }
  let w_sz = null;
  let w_szCs = null;
  if (fontSize) {
    w_sz = {
      type: 'element',
      name: 'w:sz',
      attributes: {
        'w:val': `${fontSize}`,
      },
      elements: [],
    };
    w_szCs = {
      type: 'element',
      name: 'w:szCs',
      attributes: {
        'w:val': `${fontSize}`,
      },
      elements: [],
    };
  }
  let w_color: XmlNode = null;
  if (color) {
    w_color = {
      type: 'element',
      name: 'w:color',
      attributes: { 'w:val': `${color}` },
      elements: [],
    };
  }
  let w_kern: XmlNode = null;
  if (kern) {
    w_kern = {
      type: 'element',
      name: 'w:kern',
      attributes: { 'w:val': `${kern}` },
      elements: [],
    };
  }
  let w_lang: XmlNode = null;
  if (lang || bidiLang) {
    w_lang = {
      type: 'element',
      name: 'w:lang',
      attributes: {},
      elements: [],
    };
    if (lang) w_lang.attributes['w:val'] = lang;
    if (bidiLang) w_lang.attributes['w:bidi'] = bidiLang;
  }
  let w_rPr = null;
  if (w_rFonts || w_sz || w_lang || w_color || w_kern) {
    w_rPr = {
      type: 'element',
      name: 'w:rPr',
      elements: [],
    };
    if (w_rFonts) w_rPr.elements.push(w_rFonts);
    if (w_color) w_rPr.elements.push(w_color);
    if (w_kern) w_rPr.elements.push(w_kern);
    if (w_sz) {
      w_rPr.elements.push(w_sz);
      w_rPr.elements.push(w_szCs);
    }
    if (w_lang) {
      w_rPr.elements.push(w_lang);
    }
  }
  let w_numPr = null;
  if (typeof listLvl === 'number' && listNumId) {
    w_numPr = {
      type: 'element',
      name: 'w:numPr',
      elements: [
        {
          type: 'element',
          name: 'w:ilvl',
          attributes: { 'w:val': `${listLvl}` },
          elements: [],
        },
        {
          type: 'element',
          name: 'w:numId',
          attributes: { 'w:val': `${listNumId}` },
          elements: [],
        },
      ],
    };
  }
  let w_pPr = null;
  if (w_pStyle || w_spacing || w_ind || w_jc || w_rPr || w_numPr) {
    w_pPr = {
      type: 'element',
      name: 'w:pPr',
      elements: [],
    };
    if (w_pStyle) w_pPr.elements.push(w_pStyle);
    if (w_numPr) w_pPr.elements.push(w_numPr);
    if (w_spacing) w_pPr.elements.push(w_spacing);
    if (w_ind) w_pPr.elements.push(w_ind);
    if (w_jc) w_pPr.elements.push(w_jc);
    if (w_rPr) w_pPr.elements.push(w_rPr);
  }
  const w_p = {
    type: 'element',
    name: 'w:p',
    attributes: {},
    elements: [ ],
  };
  if (w_pPr) {
    w_p.elements.push(w_pPr);
  }
  if (!items?.length) {
    w_p.elements.push(textXmlParamsNodeToXmlElementObj({ type: 'text', text: '' }, config));
  } else {
    for (let i = 0; i < items.length; i++) {
      const node = items[i];
      const { type } = node || {};
      if (type === 'text') {
        const textEle = textXmlParamsNodeToXmlElementObj(node as HtmlXmlParamsTextNode, config);
        w_p.elements.push(textEle);
      } else if (type === 'image') {
        const imgEle = imageXmlParamsNodeToXmlElementObj(node as HtmlXmlParamsImageNode, config);
        w_p.elements.push(imgEle);
      } else if (type === 'table') {
      // 应该不会存在这种情况，暂不支持内联表格
      }
    }
  }
  return w_p as XmlNode;
};
