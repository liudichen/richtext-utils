/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 14:43:23
 * @LastEditTime: 2022-10-27 14:57:31
 */
import { IGetImageXmlElementParams, IWordXmlElementObj } from '../../types';

/** 生成图片的XML元素对应的js，需要提前处理图片已获取可用的rId，及图片尺寸相关的cx,cy */
export const getImageXmlElementObj: (params: IGetImageXmlElementParams) => IWordXmlElementObj;

/** 确保cx,cy不超出最大值 */
export const ensureCxCy: (cx: number, cy: number, maxCx?: number, maxCy?: number) => ({ cx: number, cy: number });