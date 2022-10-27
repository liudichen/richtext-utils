/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-26 16:11:27
 * @LastEditTime: 2022-10-27 23:56:17
 */
import { htmlToJson } from '../../dataParse/HtmltoJson';
import { nodeParser } from './nodeParser';

export const htmlStringToXmlElementGenerateParams = (htmlStr, nodeStructOptions) => {
  const jsonArr = htmlToJson(htmlStr, { skipComment: true, skipScript: true, skipStyle: true, keepInlineStyle: true, keepClass: false, keepRawInlineStyle: false, styleCamelCase: false }, nodeStructOptions);
  console.log('jsonArr', jsonArr);
  const data = [];
  for (let i = 0; i < jsonArr.length; i++) {
    let node = nodeParser(jsonArr[i], nodeStructOptions);
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
