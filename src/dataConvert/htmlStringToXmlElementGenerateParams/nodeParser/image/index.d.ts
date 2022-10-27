/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:48:12
 * @LastEditTime: 2022-10-27 22:52:53
 */
import { IGetImageStepOneParams, IGetParagraphXmlElementParams, IJsonNodeItem, INodeStructOptions } from '../../../types';

export const imageParser: (node: IJsonNodeItem, nodeStructOptions?: INodeStructOptions, fromFigure?: boolean) => IGetParagraphXmlElementParams | IGetImageStepOneParams;
