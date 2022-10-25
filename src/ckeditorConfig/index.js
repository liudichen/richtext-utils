import { htmlToJson } from '../dataParse/HtmltoJson';
import { isAllChineseWord } from '../judge';

export const ConfigForReadForWord = {
  fontFamily: {
    options: [ '宋体', '黑体', '仿宋', '微软雅黑', 'default', 'Arial', 'Times New Roman' ],
    supportAllValues: true,
  },
  fontSize: {
    options: [
      { title: '小五', model: '9pt' },
      { title: '五号', model: '10.5pt' },
      { title: '小四', model: '12pt' },
      { title: '四号', model: '14pt' },
      { title: '小三', model: '15pt' },
      { title: '三号', model: '16pt' },
      { title: '小二', model: '18pt' },
      { title: '二号', model: '22pt' },
      { title: '小六', model: '6.5pt' },
      { title: '六号', model: '7.5pt' },
      { title: '小一', model: '24pt' },
      { title: '一号', model: '26pt' },
      { title: '小初', model: '36pt' },
      { title: '初号', model: '42pt' },
    ],
    supportAllValues: true,
  },
  indent: {
    supportAllValues: true,
  },
  htmlSupprot: {
    allow: [
      { name: /.*/,
        attributes: true,
        classes: false,
        styles: true,
      },
    ],
    disallow: [ 'o:p', 'figure', 'div' ],
  },
};

import { TEXT } from '../dataParse/constant';

const allowAttrs = [ 'src', 'href', 'alt', 'width', 'height', 'colspan', 'rowspan' ];

const attributeNameFilter = (attrName) => {
  return allowAttrs.includes(attrName);
};

const keepStyleList = [ 'color', 'line-height', 'text-indent', 'font-size', 'font-family', 'width', 'height', 'text-align',
  'vertical-align', '',
  //  <p style="line-height:150%;margin-left:55.5pt;mso-char-indent-count:-2.0;mso-para-margin-left:3.0gd;text-indent:-24.0pt;"><span style="font-size:12.0pt;">
  'margin-left', 'mso-para-margin-left', // word段落左缩进的字符数
  'margin-right', 'mso-para-margin-left', // word段落右缩进的字符数
  // style="line-height:150%;margin-top:12.0pt;mso-char-indent-count:2.0;mso-para-margin-top:1.0gd;text-indent:24.0pt;"
  'mso-char-indent-count', // word首行缩进字符数
  'margin-top', 'mso-para-margin-top', // word段前距
  'margin-bottom', 'mso-para-margin-bottom', // word段后距
  'background-color',
  'text-underline', // 下划线类型
  'mso-font-kerning', // 字符间距
];
const dropStyleList = [
  'mso-highlight', // word 高亮文本背景颜色,html时background-color的优先级更高
  'mso-color-alt',
];

const inlineStyleObjectConvert = (styles = {}) => {
  const result = {};
  const keys = Object.keys(styles);
  const fontFamilyKeys = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (k.includes('font-family')) {
      fontFamilyKeys.push(k);
      continue;
    }
    if (k.includes('language')) {
      continue;
    }
    if (keepStyleList.includes(k)) {
      result[k] = styles[k];
      continue;
    }
    // 暂不处理其他样式，待写完后端在考虑
    if (!dropStyleList.includes(k)) {
      result[k] = k;
    }
  }
  if (fontFamilyKeys.length) {
    const fontFamilys = fontFamilyKeys.map((ele) => styles[ele]);
    const index = fontFamilys.findIndex((ele) => isAllChineseWord(ele));
    if (index !== -1) {
      result['font-family'] = fontFamilys[index];
    } else if (fontFamilyKeys.includes('font-family')) {
      result['font-family'] = styles['font-family'];
    } else if (fontFamilyKeys.includes('mso-fareast-font-family')) {
      result['font-family'] = styles['mso-fareast-font-family'];
    } else if (fontFamilyKeys.includes('mso-bidi-font-family')) {
      result['font-family'] = styles['mso-bidi-font-family'];
    } else {
      result['font-family'] = styles[fontFamilyKeys[0]];
    }
  }
  return result;
};

const nodePurify = (node) => {
  let { type, tagName, children, style } = node;
  if (type === TEXT) return node;
  if (tagName === 'figcaption' || tagName === 'o:p') return false;
  if (tagName === 'div' || tagName === 'figure') {
    const res = children.map(nodePurify).filter(Boolean);
    return res.length ? res : false;
  }
  style = inlineStyleObjectConvert(style);
  if (tagName === 'span' && JSON.stringify(style) === '{}' && children.length) {
    const res = children.map(nodePurify).filter(Boolean);
    return res.length ? res : false;
  }
  return { ...node, style };
};

export const htmlPurify = (html) => {
  const json = htmlToJson(html, { attributeNameFilter, skipComment: true, skipScript: true, skipStyle: true, styleCamelCase: false });
  const data = [];
  for (let i = 0; i < json.length; i++) {
    const node = nodePurify(json[i]);
    if (!node) continue;
    if (Array.isArray(node)) {
      data.push(...node);
    } else {
      data.push(node);
    }
  }
};
