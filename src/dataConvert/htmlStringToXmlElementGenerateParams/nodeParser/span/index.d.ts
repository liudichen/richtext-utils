/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:10:41
 * @LastEditTime: 2022-10-27 23:28:11
 */

import { IJsonNodeItem, INodeStructOptions } from '../../../types';

interface ISpanSepcialStyles {
  bold?: boolean,
  italic?: boolean,
  underline?: boolean,
  strike?: boolean,
  sub?: boolean,
  sup?: boolean,
}

/** 根据span的节点信息，将span的内容解析为段落的子元素，并存放到回调数组result中，
 *  该函数没有返回值！！
 * @param node- span节点对象
 * @param specailStyles- 来自上层包裹的一些特殊属性如<b><i>等标签产生的属性，默认为不传递的话为空对象
 * @param parentStyles- 直接父级对象的样式属性，传递给直接后代，如果后代是text这获得该属性
 * @param result- 回调数组，用来递归存放结果
 * @param nodeStructOptions- 节点对象的结构配置
 */
export const parseSpan: (node: IJsonNodeItem, specailStyles: ISpanSepcialStyles, parentStyles: object, result:[], nodeStructOptions?: INodeStructOptions) => void;
