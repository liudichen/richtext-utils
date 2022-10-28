import { IGetParagraphXmlElementParams, IGetTableXmlElementParams, INodeStructOptions } from '../types';

export const htmlJsonNodeParser: (node, nodeStructOptions, fromFigure = false) => IGetParagraphXmlElementParams | IGetParagraphXmlElementParams[] | IGetTableXmlElementParams;

/** 将html字符串转换为待生成xml元素的参数 */
export const htmlStringToXmlElementGenerateParams: (htmlStr: string, nodeStructOptions?: INodeStructOptions) => (IGetParagraphXmlElementParams | IGetTableXmlElementParams)[];
