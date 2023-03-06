import type { HtmlXmlParamsTextNode, XmlElementGenerationConfig, XmlNode } from '@/types/index';

export const textXmlParamsNodeToXmlElementObj = (textNode: HtmlXmlParamsTextNode, config :XmlElementGenerationConfig = {}) => {
  const {
    fontFamily: fontFamilyProp, // 字体
    text, // 文本
    fontSize: fontSizeProp, // 小四
    bold, // 加粗
    color, // 文字颜色
    italic, // 倾斜
    underline, // 下划线样式
    underlineColor,
    strike, // 删除线
    backgroundColor, // 文字高亮背景色
    sub, // 下标
    sup, // 上标
    // shd, // 文字底纹
    kern, // 字间距单位pt
    border, // 文本外框
    borderColor,
  } = textNode;
  const { defaultFontFamily = '宋体', defaultFontSize = 24 } = config || {};
  const fontFamily = fontFamilyProp ?? defaultFontFamily;
  const fontSize = fontSizeProp ?? defaultFontSize;
  const w_r: XmlNode = {
    type: 'element',
    name: 'w:r',
    elements: [
      {
        type: 'element',
        name: 'w:rPr',
        elements: [
          {
            type: 'element',
            name: 'w:rFonts',
            attributes: { 'w:hint': 'eastAsia' },
            elements: [],
          },
          // 格式插入这里
        ],
      },
      {
        type: 'element', name: 'w:t', attributes: (!text || text.startsWith(' ')) ? { 'xml:space': 'preserve' } : {}, elements: [{ type: 'text', text: `${text || ''}` }],
      },
    ],
  };
  if (fontFamily) {
    w_r.elements[0].elements[0].attributes = { 'w:hAnsi': fontFamily, 'w:ascii': fontFamily, 'w:eastAsia': fontFamily, 'w:hint': 'eastAsia' };
  }
  if (typeof kern !== 'undefined') {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:kern', attributes: { 'w:val': `${kern}` }, elements: [] });
  }
  if (bold) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:b', elements: [] });
    w_r.elements[0].elements.push({ type: 'element', name: 'w:bCs', elements: [] });
  }
  if (italic) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:i', elements: [] });
    w_r.elements[0].elements.push({ type: 'element', name: 'w:iCs', elements: [] });
  }
  if (strike) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:strike', elements: [] });
  }
  if (color) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:color', attributes: { 'w:val': color }, elements: [] });
  }
  if (fontSize) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:sz', attributes: { 'w:val': `${fontSize}` }, elements: [] });
    w_r.elements[0].elements.push({ type: 'element', name: 'w:szCs', attributes: { 'w:val': `${fontSize}` }, elements: [] });
  }
  if (backgroundColor) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:highlight', attributes: { 'w:val': `${backgroundColor}` }, elements: [] });
  }
  if (underline) {
    const attr = { 'w:val': underline };
    if (underlineColor) {
      attr['w:color'] = underlineColor;
    }
    w_r.elements[0].elements.push({ type: 'element', name: 'w:u', attributes: attr, elements: [] });
  }
  if (border) {
    w_r.elements[0].elements.push({
      type: 'element', name: 'w:bdr', elements: [],
      attributes: {
        'w:val': 'single', 'w:sz': '4', 'w:space': '0', 'w:color': borderColor || 'auto',
      },
    });
  }
  // if (shd) {
  //   w_r.elements[0].elements.push({ type: 'element', name: 'w:shd', attributes: { 'w:val': 'pct15', 'w:color': 'auto', 'w:fill': 'FFFFFF' }, elements: [] });
  // }
  if (sub) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:vertAlign', attributes: { 'w:val': 'subscript' }, elements: [] });
  } else if (sup) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:vertAlign', attributes: { 'w:val': 'superscript' }, elements: [] });
  }
  return w_r;
};
