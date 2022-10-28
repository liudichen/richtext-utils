import { IGetParagraphXmlElementParams, IGetTableXmlElementParams, INodeStructAndConvertConfig } from '../types';

export const htmlJsonNodeParser: (node, config, fromFigure = false) => IGetParagraphXmlElementParams | IGetParagraphXmlElementParams[] | IGetTableXmlElementParams;

/** 将html字符串转换为待生成xml元素的参数 */
export const htmlStringToXmlElementGenerateParams: (htmlStr: string, config?: INodeStructAndConvertConfig) => (IGetParagraphXmlElementParams | IGetTableXmlElementParams)[];
