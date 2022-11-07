/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 10:35:01
 * @LastEditTime: 2022-11-07 22:13:55
 */
import { IGetImageStepTwoParamsFn, IGetTableXmlElementParams, IJsonNodeItem, INodeStructAndConvertConfig } from '../../types';

export declare const tableHtmlJsonNodeParser: (node: IJsonNodeItem, config?: INodeStructAndConvertConfig, getImageStepTwoParamsFn?: IGetImageStepTwoParamsFn) => Promise<IGetTableXmlElementParams>;
