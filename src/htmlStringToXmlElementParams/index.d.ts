/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 20:14:21
 * @LastEditTime: 2022-11-07 18:33:43
 */
import { IGetImageStepTwoParamsFn, IGetParagraphXmlElementParams, IGetTableXmlElementParams, IJsonNodeItem, INodeStructAndConvertConfig } from '../types';

export const htmlJsonNodeParser: (node: IJsonNodeItem | IJsonNodeItem[], config?: INodeStructAndConvertConfig, getImageStepTwoParamsFn: IGetImageStepTwoParamsFn) => Promise<IGetParagraphXmlElementParams | IGetParagraphXmlElementParams[] | IGetTableXmlElementParams>;

/** 将html字符串转换为待生成xml元素的参数 */
export const htmlStringToXmlElementGenerateParams: (htmlStr: string, config?: INodeStructAndConvertConfig) => (IGetParagraphXmlElementParams | IGetTableXmlElementParams)[];

export const ignoreTags = [ 'o:p', 'figcaption' ];
