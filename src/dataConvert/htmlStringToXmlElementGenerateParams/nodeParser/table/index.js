/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:39:38
 * @LastEditTime: 2022-10-27 23:40:06
 */
import { DefaultNodeStructOptions } from '../../../dataParse';

export const tableParser = (node, nodeStructOptions, fromFigure) => {
  const { NODENAME, NODETAG, TEXTTAG, TEXTVALUE, COMMENTTAG, COMMENTVALUE, CHILDREN, STYLE, CLASSLIST, ATTRIBUTES, INLINESTYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);

};
