/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:35:11
 * @LastEditTime: 2022-11-07 15:00:47
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';
import { paragraphHtmlJsonNodeParser } from '../paragraph';

export const headHtmlJsonNodeParser = async (node, config, getImageStepTwoParamsFn) => {
  const { NODENAME, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, config);
  const { [NODENAME]: tagName, [STYLE]: style = {} } = node;
  const lvl = tagName.slice(-1);
  const result = await paragraphHtmlJsonNodeParser({ ...node, [STYLE]: { ...style, pStyle: lvl } }, config, getImageStepTwoParamsFn);
  return result;
};
