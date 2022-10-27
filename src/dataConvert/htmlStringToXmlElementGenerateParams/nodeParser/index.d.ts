/*
 * @Description: 
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:46:54
 * @LastEditTime: 2022-10-27 23:53:44
 */
import { IGetParagraphXmlElementParams, IGetTableXmlElementParams, IJsonNodeItem, INodeStructOptions } from "../../../types";



export const nodeParser: (node: IJsonNodeItem, nodeStructOptions?: INodeStructOptions, fromFigure?: boolean) => IGetParagraphXmlElementParams | IGetTableXmlElementParams | IGetParagraphXmlElementParams[],