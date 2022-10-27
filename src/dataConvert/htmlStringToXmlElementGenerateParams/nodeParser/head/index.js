/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:35:11
 * @LastEditTime: 2022-10-27 23:35:54
 */
import { DefaultNodeStructOptions } from '../../../dataParse';
import { paragraphParser } from '../paragraph';

export const headParser = (node, nodeStructOptions) => {
  const { NODENAME, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [NODENAME]: tagName, [STYLE]: style = {} } = node;
  const lvl = tagName.slice(-1);
  return paragraphParser({ ...node, [STYLE]: { ...style, pStyle: lvl } }, nodeStructOptions);
};
