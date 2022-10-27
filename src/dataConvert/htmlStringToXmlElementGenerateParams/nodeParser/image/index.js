/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:25:21
 * @LastEditTime: 2022-10-27 22:27:10
 */
import { DefaultNodeStructOptions } from '../../../dataParse';
import { getImageStepOneParams } from '../../style';

export const imageParser = (node, nodeStructOptions, fromFigure) => {
  const { STYLE, ATTRIBUTES, CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [ATTRIBUTES]: attrs = {}, [STYLE]: style } = node;
  const imgNode = getImageStepOneParams({ type: 'image', ...attrs, style });
  return fromFigure ? { type: 'p', align: 'center', [CHILDREN]: imgNode } : imgNode;
};
