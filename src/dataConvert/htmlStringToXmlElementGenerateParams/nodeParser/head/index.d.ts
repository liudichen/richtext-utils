/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:37:29
 * @LastEditTime: 2022-10-27 23:38:17
 */
import { IGetParagraphXmlElementParams, IJsonNodeItem, INodeStructOptions } from '../../../types';

/** 将1-6级标题转换为生成对应级别段落的参数，会使用模板的预定义标题格式*/
export const headParser: (node: IJsonNodeItem, nodeStructOptions?: INodeStructOptions) => IGetParagraphXmlElementParams;
