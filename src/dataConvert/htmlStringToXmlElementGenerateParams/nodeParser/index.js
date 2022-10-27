/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:42:10
 * @LastEditTime: 2022-10-27 23:45:48
 */
import { DefaultNodeStructOptions } from '../../dataParse/constant';
import { paragraphParser } from './paragraph';
import { imageParser } from './image';
import { listParser } from './list';
import { headParser } from './head';
import { tableParser } from './table';

export const nodeParser = (node, nodeStructOptions, fromFigure = false) => {
  const { NODENAME, NODETAG, CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { type, [NODENAME]: tagName, [CHILDREN]: children } = node;
  if (type === NODETAG && [ 'o:p', 'figcaption' ].includes(tagName)) { return false; }
  if (tagName === 'figure') {
    const res = children.map((ele) => nodeParser(ele, nodeStructOptions, true)).filter(Boolean);
    return res.length ? res : false;
  }
  if (tagName === 'p') return paragraphParser(node, nodeStructOptions);
  if (tagName === 'table') return tableParser(node, nodeStructOptions, fromFigure);
  if (tagName === 'img') return imageParser(node, nodeStructOptions, fromFigure);
  if (tagName === 'ul' || tagName === 'ol') return listParser(node, nodeStructOptions);
  if (tagName && /^h[1-6]$/.test(tagName)) return headParser(node, nodeStructOptions);
};
