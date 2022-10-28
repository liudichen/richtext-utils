/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:35:11
 * @LastEditTime: 2022-10-28 10:32:23
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';
import { paragraphHtmlJsonNodeParser } from '../paragraph';

export const headHtmlJsonNodeParser = (node, nodeStructOptions) => {
  const { NODENAME, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [NODENAME]: tagName, [STYLE]: style = {} } = node;
  const lvl = tagName.slice(-1);
  return paragraphHtmlJsonNodeParser({ ...node, [STYLE]: { ...style, pStyle: lvl } }, nodeStructOptions);
};
