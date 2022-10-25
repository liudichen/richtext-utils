/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 16:09:53
 * @LastEditTime: 2022-10-25 22:34:18
 */
import { camelCase } from '../../dataParse/HtmltoJson';

export const isAllChineseWord = (str) => /^[\u4e00-\u9fa5]+$/.test(str);
export const hasChineseWord = (str) => /[\u4e00-\u9fa5]+/.test(str);

export const getTextElement = (params) => {
  let {
    fontFamily = '宋体', // 字体
    text, // 文本
    fontSize = 24, // 小四
    bold, // 加粗
    color, // 文字颜色
    italic, // 倾斜
    underline, // 下划线样式
    strike, // 删除线
    backgroundColor, // 文字高亮背景色
    sub, // 下标
    sup, // 上标
    shd, // 文字底纹
  } = params || {};
  if (underline) underline = camelCase(underline);
  const w_r = {
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
            attributes: { 'w:hAnsi': fontFamily, 'w:ascii': fontFamily, 'w:eastAsia': fontFamily, 'w:hint': 'eastAsia' },
            elements: [],
          },
        ],
      },
      {
        type: 'element', name: 'w:t', elements: [{ type: 'text', text: `${text || ' '}` }],
      },
    ],
  };
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
  w_r.elements[0].elements.push({ type: 'element', name: 'w:sz', attributes: { 'w:val': `${fontSize}` }, elements: [] });
  w_r.elements[0].elements.push({ type: 'element', name: 'w:szCs', attributes: { 'w:val': `${fontSize}` }, elements: [] });
  if (backgroundColor) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:highlight', attributes: { 'w:val': `${backgroundColor}` }, elements: [] });
  }
  if (underline) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:u', attributes: { 'w:val': 'underline' }, elements: [] });
  }
  if (shd) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:shd', attributes: { 'w:val': 'pct15', 'w:color': 'auto', 'w:fill': 'FFFFFF' }, elements: [] });
  }
  if (sub) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:vertAlign', attributes: { 'w:val': 'subscript' }, elements: [] });
  } else if (sup) {
    w_r.elements[0].elements.push({ type: 'element', name: 'w:vertAlign', attributes: { 'w:val': 'superscript' }, elements: [] });
  }
};
