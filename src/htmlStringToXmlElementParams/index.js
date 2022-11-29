/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 09:41:20
 * @LastEditTime: 2022-11-08 20:58:09
 */
import { DefaultNodeStructOptions, htmlToJson } from '../JsonAndHtml';
import { paragraphHtmlJsonNodeParser } from './paragraph';
import { imageHtmlJsonNodeParser } from './image';
import { listHtmlJsonNodeParser } from './list';
import { headHtmlJsonNodeParser } from './head';
import { tableHtmlJsonNodeParser } from './table';

export const ignoreTags = [ 'o:p', 'figcaption' ];

export const htmlJsonNodeParser = async (node, config, getImageStepTwoParamsFn) => {
  const { NODENAME, NODETAG, CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, config);
  const { type, [NODENAME]: tagName, [CHILDREN]: children } = node;
  if (type === NODETAG && ignoreTags.includes(tagName)) { return false; }
  if (tagName === 'figure') {
    const childs = children.filter((ele) => !/^fig/.test(ele[NODENAME]));
    if (!childs.length) return false;
    if (!childs.find((ele) => ele[NODENAME] === 'p' || ele[NODENAME] === 'table')) {
      return await paragraphHtmlJsonNodeParser(node, config, getImageStepTwoParamsFn);
    }
    const data = [];
    for (let i = 0; i < childs.length; i++) {
      const ele = childs[i];
      let res = await htmlJsonNodeParser(ele, config, getImageStepTwoParamsFn);
      if (res) {
        if (!Array.isArray(res)) {
          data.push(res);
        } else {
          res = res.filter(Boolean);
          if (res.length) data.push(...res);
        }
      }
    }
    return data.length ? data : false;
  }
  if (tagName === 'p') return await paragraphHtmlJsonNodeParser(node, config, getImageStepTwoParamsFn);
  if (tagName === 'table') return await tableHtmlJsonNodeParser(node, config, getImageStepTwoParamsFn);
  if (tagName === 'img') return await imageHtmlJsonNodeParser(node, config, getImageStepTwoParamsFn);
  if (tagName === 'ul' || tagName === 'ol') return await listHtmlJsonNodeParser(node, config, getImageStepTwoParamsFn);
  if (tagName && /^h[1-6]$/.test(tagName)) return await headHtmlJsonNodeParser(node, config, getImageStepTwoParamsFn);
};

export const htmlStringToXmlElementGenerateParams = async (htmlStr, config, getImageStepTwoParamsFn) => {
  const jsonArr = htmlToJson(htmlStr, { skipComment: true, skipScript: true, skipStyle: true, keepInlineStyle: true, keepClass: false, keepRawInlineStyle: false, styleCamelCase: false }, config);
  const data = [];
  for (let i = 0; i < jsonArr.length; i++) {
    let node = await htmlJsonNodeParser(jsonArr[i], config, getImageStepTwoParamsFn);
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
