/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-11-07 20:36:18
 * @LastEditTime: 2022-11-07 20:37:46
 */
import { IGetImageStepTwoParamsFn, INodeStructAndConvertConfig, IWordXmlElementObj } from '../../types';

export const htmlStringToXmlJsonElements: (htmlStr: string, config?: INodeStructAndConvertConfig, getImageStepTwoParamsFn?: IGetImageStepTwoParamsFn) => Promise<IWordXmlElementObj[]>;
