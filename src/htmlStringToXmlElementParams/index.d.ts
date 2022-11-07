/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 20:14:21
 * @LastEditTime: 2022-11-07 22:14:08
 */
import { IGetImageStepTwoParamsFn, IGetParagraphXmlElementParams, IGetTableXmlElementParams, IJsonNodeItem, INodeStructAndConvertConfig } from '../types';

export declare const htmlJsonNodeParser: (node: IJsonNodeItem | IJsonNodeItem[], config?: INodeStructAndConvertConfig, getImageStepTwoParamsFn: IGetImageStepTwoParamsFn) => Promise<IGetParagraphXmlElementParams | IGetParagraphXmlElementParams[] | IGetTableXmlElementParams>;

/** 将html字符串转换为待生成xml元素的参数 */
export declare const htmlStringToXmlElementGenerateParams: (htmlStr: string, config?: INodeStructAndConvertConfig, getImageStepTwoParamsFn?: IGetImageStepTwoParamsFn) => Promise<(IGetParagraphXmlElementParams | IGetTableXmlElementParams)[]>;

export declare const ignoreTags = [ 'o:p', 'figcaption' ];
