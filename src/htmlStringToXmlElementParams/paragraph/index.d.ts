/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 10:04:38
 * @LastEditTime: 2022-11-07 22:13:38
 */
import { IGetParagraphXmlElementParams, IJsonNodeItem, INodeStructAndConvertConfig, IImageStepOneResult, IGetImageStepTwoParamsFn } from '../../types';

/** 从段落p的style中获取生成段落的参数属性（不含items） */
export declare const getParagraphElementParamsFormStyles: (styles: object) => IGetParagraphXmlElementParams;

/** 从p节点对象获取生产段落的参数，由于要考虑包裹figure的图片的兼容性，返回的是1个数组
 * 如果p里面包含了figure下的img则会将改img取出来单独形成一个段落。但是如果img没有包裹在figure里则直接处理为p的子元素
 */
export declare const paragraphHtmlJsonNodeParser: (node: IJsonNodeItem, config?: INodeStructAndConvertConfig, getImageStepTwoParamsFn?: IGetImageStepTwoParamsFn) => Promise<[ IGetParagraphXmlElementParams ] | [IGetParagraphXmlElementParams, IGet] | [IImageStepOneResult, IGetParagraphXmlElementParams]>;
