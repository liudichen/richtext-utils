/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:29:45
 * @LastEditTime: 2022-10-28 10:33:52
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';
import { paragraphHtmlJsonNodeParser } from '../paragraph';

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
        const p = paragraphHtmlJsonNodeParser({ ...li, [CHILDREN]: children.slice(start, end), [STYLE]: { ...style, 'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd` } }, nodeStructOptions);
        if (p.length) result.push(p[0]);
      }
      const lis = children[end]?.[CHILDREN];
      if (lis?.length) { lis.forEach((ele) => parseLi(ele, lvl + 1, result, nodeStructOptions)); }
      start = end + 1;
    }
    if (start < children.length) {
      const p = paragraphHtmlJsonNodeParser({ ...li, [CHILDREN]: children.slice(start), [STYLE]: { ...style, 'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd` } }, nodeStructOptions);
      if (p.length) result.push(p[0]);
    }
  } else {
    const p = paragraphHtmlJsonNodeParser({ ...li, [STYLE]: { ...style, 'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd` } }, nodeStructOptions);
    if (p.length) result.push(p[0]);
  }
};
// 处理有序列表或无序列表，直接按悬挂缩进2个字符的段落处理，不会获得任何样式
export const listHtmlJsonNodeParser = (node, nodeStructOptions) => {
  const { CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [CHILDREN]: children } = node;
  const result = [];
  for (let i = 0; i < children.length; i++) {
    const li = children[i];
    parseLi(li, 0, result, nodeStructOptions);
  }
  return result;
};
