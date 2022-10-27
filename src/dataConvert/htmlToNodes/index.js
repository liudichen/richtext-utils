/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-26 16:11:27
 * @LastEditTime: 2022-10-27 12:36:41
 */
import { DefaultNodeStructOptions } from '../../dataParse/constant';
import { htmlToJson } from '../../dataParse/HtmltoJson';
import { getParagraphParams } from '../style';
import { getTextParams } from '../style';

const parseImage = (node, nodeStructOptions) => {
  const { STYLE, ATTRIBUTES } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [ATTRIBUTES]: attrs, [STYLE]: style } = node;
  return { type: 'image', ...attrs, style };
};
const parseSpan = (node, specailStyles = {}, parentStyles = {}, result = [], nodeStructOptions) => {
  const { NODENAME, TEXTTAG, TEXTVALUE, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [NODENAME]: tagName, type, [STYLE]: style, [TEXTVALUE]: text, [CHILDREN]: children } = node;
  if (type === TEXTTAG) {
    const textParams = getTextParams({ ...parentStyles, ...specailStyles });
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
    children.forEach((ele) => parseSpan(ele, newSpecialStyles, { ...parentStyles }, result, nodeStructOptions));
  } else if (tagName === 'span') {
    children.forEach((ele) => parseSpan(ele, { ...specailStyles }, { ...style }, result, nodeStructOptions));
  } else if (tagName === 'img') {
    result.push(parseImage(node, nodeStructOptions));
  }
};

const parseParagraph = (node, nodeStructOptions) => {
  const { NODENAME, TEXTTAG, TEXTVALUE, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [CHILDREN]: children, [STYLE]: style } = node;
  const data = [];
  let imgFirst = true;
  const paragraphParams = getParagraphParams(style);
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
      parseSpan(child, {}, {}, result, nodeStructOptions);
      items.push(...result);
      if (!data.length) imgFirst = false;
    } else if (tagName === 'img') {
      data.push(parseImage(child, nodeStructOptions));
    }
  }
  items = items.filter((ele) => ele.type !== TEXTTAG || ele[TEXTVALUE] !== '');
  if (imgFirst) {
    data.push({ ...paragraphParams, items });
  } else {
    data.unshift({ ...paragraphParams, items });
  }
  return data;
};

const parseLi = (li, lvl = 0, result = [], nodeStructOptions) => {
  const { NODENAME, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [STYLE]: style = {}, [CHILDREN]: children } = li;
  const ou = [];
  for (let i = 0; i < children.length; i++) {
    if (children[i]?.[NODENAME] === 'ol' || children[i]?.[NODENAME] === 'ul') {
      ou.push(i);
    }
  }
  if (ou.length) {
    let start = 0;
    let end = 0;
    for (let i = 0; i < ou.length; i++) {
      end = ou[i];
      if (end > start) {
        const p = parseParagraph({ ...li, [CHILDREN]: children.slice(start, end), [STYLE]: { ...style, 'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd` } }, nodeStructOptions);
        if (p.length) result.push(p[0]);
      }
      const lis = children[end]?.[CHILDREN];
      if (lis?.length) { lis.forEach((ele) => parseLi(ele, lvl + 1, result, nodeStructOptions)); }
      start = end + 1;
    }
    if (start < children.length) {
      const p = parseParagraph({ ...li, [CHILDREN]: children.slice(start), [STYLE]: { ...style, 'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd` } }, nodeStructOptions);
      if (p.length) result.push(p[0]);
    }
  } else {
    const p = parseParagraph({ ...li, [STYLE]: { ...style, 'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd` } }, nodeStructOptions);
    if (p.length) result.push(p[0]);
  }
};
// 直接按悬挂缩进2个字符的段落处理，不会获得任何样式
const parseList = (node, nodeStructOptions) => {
  const { CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [CHILDREN]: children } = node;
  const result = [];
  for (let i = 0; i < children.length; i++) {
    const li = children[i];
    parseLi(li, 0, result, nodeStructOptions);
  }
  return result;
};

const parseHead = (node, nodeStructOptions) => {
  const { NODENAME, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [NODENAME]: tagName, [STYLE]: style = {} } = node;
  const lvl = tagName.slice(-1);
  return parseParagraph({ ...node, style: { ...style, pStyle: lvl } }, nodeStructOptions);
};

const parseTable = (node, nodeStructOptions) => {
  const { NODENAME, NODETAG, TEXTTAG, TEXTVALUE, COMMENTTAG, COMMENTVALUE, CHILDREN, STYLE, CLASSLIST, ATTRIBUTES, INLINESTYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);

};
const parseNode = (node, nodeStructOptions) => {
  const { NODENAME, NODETAG, CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { type, [NODENAME]: tagName, [CHILDREN]: children } = node;
  if (type === NODETAG && [ 'o:p', 'figcaption' ].includes(tagName)) { return false; }
  if (tagName === 'figure') {
    const res = children.map((ele) => parseNode(ele, nodeStructOptions)).filter(Boolean);
    return res.length ? res : false;
  }
  if (tagName === 'p') return parseParagraph(node, nodeStructOptions);
  if (tagName === 'table') return parseTable(node, nodeStructOptions);
  if (tagName === 'img') return parseImage(node, nodeStructOptions);
  if (tagName === 'ul' || tagName === 'ol') return parseList(node, nodeStructOptions);
  if (tagName && /^h[1-6]$/.test(tagName)) return parseHead(node, nodeStructOptions);
};

export const htmlToNodes = (htmlStr, nodeStructOptions) => {
  const jsonArr = htmlToJson(htmlStr, { skipComment: true, skipScript: true, skipStyle: true, keepInlineStyle: true, keepClass: false, keepRawInlineStyle: false, styleCamelCase: false }, nodeStructOptions);
  console.log('jsonArr', jsonArr);
  const data = [];
  for (let i = 0; i < jsonArr.length; i++) {
    let node = parseNode(jsonArr[i], nodeStructOptions);
    // console.log('node', i, node);
    if (!node) continue;
    if (Array.isArray(node)) { // 有一定的可能性是2层数组（figure导致的）
      node = node.filter(Boolean);
      const arr = [];
      for (let j = 0; j < node.length; j++) {
        const nn = node[j];
        if (Array.isArray(nn)) {
          arr.push(...nn.filter(Boolean));
        } else {
          arr.push(nn);
        }
      }
      if (arr.length) {
        data.push(...arr);
      }
    } else {
      data.push(node);
    }
  }
  return data;
};
