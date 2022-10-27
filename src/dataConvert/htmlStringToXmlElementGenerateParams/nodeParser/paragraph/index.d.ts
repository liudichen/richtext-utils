/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:56:01
 * @LastEditTime: 2022-10-27 23:08:36
 */
import { IGetImageStepOneParams } from 'src/dataConvert/style';
import { IGetParagraphXmlElementParams, IJsonNodeItem, INodeStructOptions } from '../../../types';

/** 从p节点对象获取生产段落的参数，由于要考虑包裹figure的图片的兼容性，返回的是1个数组
 * 如果p里面包含了figure下的img则会将改img取出来单独形成一个段落。但是如果img没有包裹在figure里则直接处理为p的子元素
 */
export const paragraphParser: (node: IJsonNodeItem, nodeStructOptions?: INodeStructOptions) => [ IGetParagraphXmlElementParams ] | [IGetParagraphXmlElementParams, IGetImageStepOneParams] | [IGetImageStepOneParams, IGetParagraphXmlElementParams];
