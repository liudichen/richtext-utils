/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 09:41:20
 * @LastEditTime: 2022-10-28 14:56:03
 */
import { DefaultNodeStructOptions, htmlToJson } from '../JsonAndHtml';
import { paragraphHtmlJsonNodeParser } from './paragraph';
import { imageHtmlJsonNodeParser } from './image';
import { listHtmlJsonNodeParser } from './list';
import { headHtmlJsonNodeParser } from './head';
import { tableHtmlJsonNodeParser } from './table';

export const htmlJsonNodeParser = (node, nodeStructOptions, fromFigure = false) => {
  const { NODENAME, NODETAG, CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { type, [NODENAME]: tagName, [CHILDREN]: children } = node;
  if (type === NODETAG && [ 'o:p', 'figcaption' ].includes(tagName)) { return false; }
  if (tagName === 'figure') {
    const res = children.map((ele) => htmlJsonNodeParser(ele, nodeStructOptions, true)).filter(Boolean);
    return res.length ? res : false;
  }
  if (tagName === 'p') return paragraphHtmlJsonNodeParser(node, nodeStructOptions);
  if (tagName === 'table') return tableHtmlJsonNodeParser(node, nodeStructOptions, fromFigure);
  if (tagName === 'img') return imageHtmlJsonNodeParser(node, nodeStructOptions, fromFigure);
  if (tagName === 'ul' || tagName === 'ol') return listHtmlJsonNodeParser(node, nodeStructOptions);
  if (tagName && /^h[1-6]$/.test(tagName)) return headHtmlJsonNodeParser(node, nodeStructOptions);
};

export const htmlStringToXmlElementGenerateParams = (htmlStr, nodeStructOptions) => {
  const jsonArr = htmlToJson(htmlStr, { skipComment: true, skipScript: true, skipStyle: true, keepInlineStyle: true, keepClass: false, keepRawInlineStyle: false, styleCamelCase: false }, nodeStructOptions);
  console.log('jsonArr', jsonArr);
  const data = [];
  for (let i = 0; i < jsonArr.length; i++) {
    let node = htmlJsonNodeParser(jsonArr[i], nodeStructOptions);
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
