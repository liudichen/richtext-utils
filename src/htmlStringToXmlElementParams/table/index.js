/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:39:38
 * @LastEditTime: 2022-10-28 10:36:41
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';

// eslint-disable-next-line no-unused-vars
export const tableHtmlJsonNodeParser = (node, nodeStructOptions, fromFigure = false) => {
  // eslint-disable-next-line no-unused-vars
  const { NODENAME, NODETAG, TEXTTAG, TEXTVALUE, COMMENTTAG, COMMENTVALUE, CHILDREN, STYLE, CLASSLIST, ATTRIBUTES, INLINESTYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  return {};
};
