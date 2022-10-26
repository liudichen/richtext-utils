/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-26 16:11:27
 * @LastEditTime: 2022-10-26 22:51:02
 */
import { TAG } from '../../dataParse/constant';
import { htmlToJson } from '../../dataParse/HtmltoJson';
import { getParagraphParams } from '../style';
import { getTextParams } from '../style';
const parseImage = (node) => {
  const { attrs, style } = node;
  return { type: 'image', ...attrs, style };
};
const parseSpan = (node, specailStyles = {}, parentStyles = {}, result = []) => {
  const { tagName, type, style, value, children } = node;
  if (type === 'text') {
    const textParams = getTextParams({ ...parentStyles, ...specailStyles });
    result.push({ type, text: value, ...textParams });
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
    children.forEach((ele) => parseSpan(ele, newSpecialStyles, { ...parentStyles }, result));
  } else if (tagName === 'span') {
    children.forEach((ele) => parseSpan(ele, { ...specailStyles }, { ...style }, result));
  }
};

const parseParagraph = (node) => {
  const { children, style } = node;
  const data = [];
  let imgFirst = true;
  const paragraphParams = getParagraphParams(style);
  const items = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const { tagName } = child;
    if (tagName === 'span') {
      const result = [];
      parseSpan(child, {}, {}, result);
      items.push(...result);
      if (!data.length) imgFirst = false;
    } else if (tagName === 'img') {
      data.push(parseImage(child));
    }
  }
  if (imgFirst) {
    data.push({ ...paragraphParams, items });
  } else {
    data.unshift({ ...paragraphParams, items });
  }
  return data;
};

const parseLi = (li, lvl = 0, result = []) => {
  for (let i = 0; i < li.children.length; i++) {
    const node = li.children[i];
    const { tagName, style, children } = node;
    if (tagName === 'span') {
      result.push(parseParagraph({ ...node, style: { ...style, 'mso-char-indent-count': `${lvl + 1}.0gd`, 'mso-para-margin-left': `${lvl}.0gd` } }));
    } else if (tagName === 'ol' || tagName === 'ul') {
      children.forEach((ele) => parseLi(ele, lvl + 1, result));
    }
  }
};
// 直接按悬挂缩进2个字符的段落处理，不会获得任何样式
const parseList = (node) => {
  const { children } = node;
  const result = [];
  for (let i = 0; i < children.length; i++) {
    const li = children[i];
    parseLi(li, 0, result);
  }
};

const parseHead = (node) => {
  const { tagName, style } = node;
  const lvl = tagName.slice(-1);
  return parseParagraph({ ...node, style: { ...style, pStyle: lvl } });
};

const parseTable = (node) => {

};
const parseNode = (node) => {
  const { type, tagName, children } = node;
  if (type === TAG && [ 'o:p', 'figcaption' ].includes(tagName)) { return false; }
  if (tagName === 'figure') {
    const res = children.map(parseNode).filter(Boolean);
    return res.length ? res : false;
  }
  if (tagName === 'p') return parseParagraph(node);
  if (tagName === 'table') return parseTable(node);
  if (tagName === 'img') return parseImage(node);
  if (tagName === 'ul' || tagName === 'ol') return parseList(node);
  if (tagName && /^h[1-6]$/.test(tagName)) return parseHead(node);
};

export const htmlToNodes = (htmlStr) => {
  const jsonArr = htmlToJson(htmlStr, { skipComment: true, skipScript: true, skipStyle: true, keepInlineStyle: true, keepClass: false, keepRawInlineStyle: false, styleCamelCase: false });
  const data = [];
  for (let i = 0; i < jsonArr.length; i++) {
    let node = parseNode(jsonArr[i]);
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
