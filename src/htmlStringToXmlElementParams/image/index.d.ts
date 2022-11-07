/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:33:03
 * @LastEditTime: 2022-11-07 11:30:56
 */
import { IImageStepOneResult, IGetParagraphXmlElementParams, IJsonNodeItem, INodeStructAndConvertConfig, IImageStepTwoResult, IGetImageStepTwoParamsFn } from '../../types';

interface IImageStepOneParam {
  type: 'image',
  step: 0,
  cx?: number,
  cy?: number,
  src: string,
}

/**  获取图片的阶段1的参数，后续还需要处理图片rId或获取图片尺寸。style里注入了img属性获得的width和height，而不是style里的
 *  如果入参里有宽高尺寸则会将其转化为cx,cy
 * 否则需要后续获取图片实际宽高并另行处理
 * ```
 *  StepTwo就是获取cx,cy(如果有就不需要)及移动图片获取rId等操作，后续这些操作是在生成xml文档时进行的
 * ```
*/
export const getImageElementStepOneParamsFromHtmlAttributes: (params: IImageStepOneResult) => IImageStepOneParam;

/** 将html转化成的js对象转化为相应的待生成xml的节点参数对象 */
export const imageHtmlJsonNodeParser: (node: IJsonNodeItem, config?: INodeStructAndConvertConfig, fromFigure?: boolean, getImageStepTwoParamsFn?: IGetImageStepTwoParamsFn) => Promise<IGetParagraphXmlElementParams | IImageStepTwoResult>;
