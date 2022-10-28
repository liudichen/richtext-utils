/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:31:15
 * @LastEditTime: 2022-10-28 10:01:25
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';

// 获取图片的阶段1的参数，后续还需要处理图片rId或获取图片尺寸
export const getImageElementStepOneParamsFromHtmlAttributes = (params) => {
  const { src, width, height } = params;
  const data = { type: 'image', step: 0, src };
  if (+width > 0 && +height > 0) { // 转化为xml里的cx,cy
    const rate = 9525;
    data.cx = Math.round(+width * rate);
    data.cy = Math.round(+height * rate);
  }
  return data;
};

export const imageHtmlJsonNodeParser = (node, nodeStructOptions, fromFigure) => {
  const { STYLE, ATTRIBUTES, CHILDREN } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [ATTRIBUTES]: attrs = {}, [STYLE]: style } = node;
  const imgNode = getImageElementStepOneParamsFromHtmlAttributes({ type: 'image', ...attrs, style });
  return fromFigure ? { type: 'p', align: 'center', [CHILDREN]: imgNode } : imgNode;
};
