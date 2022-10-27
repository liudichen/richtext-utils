/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:29:33
 * @LastEditTime: 2022-10-27 23:33:51
 */
import { IGetParagraphXmlElementParams, IJsonNodeItem, INodeStructOptions } from '../../../types';

/**
 * 将有html的有序列表无序列表转化为段落，会丢失列表属性，被处理成了普通段落。
 * 每1级按悬挂缩进2个字符，段落左侧缩进(lvl-1)*2个字符处理。
 */
export const listParser: (node: IJsonNodeItem, nodeStructOptions?: INodeStructOptions) => IGetParagraphXmlElementParams[];
