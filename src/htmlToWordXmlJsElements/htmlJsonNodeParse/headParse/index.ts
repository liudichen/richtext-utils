import type { HtmlJsonNode } from '@iimm/shared';
import type { HtmlJsonNodeParserOptions, GetImageStepTwoParamsFn } from '@/types/index';
import { paragraphHtmlJsonNodeParser } from '../paragrahParse';

export const headHtmlJsonNodeParser = async (node: HtmlJsonNode, getImageStepTwoParamsFn?: GetImageStepTwoParamsFn, options?: HtmlJsonNodeParserOptions) => {
  const { NODENAME = 'name', STYLE = 'style' } = options || {};
  const { [NODENAME]: tagName, [STYLE]: style = {} } = node;
  const lvl = tagName.slice(-1);
  const result = await paragraphHtmlJsonNodeParser({ ...node, [STYLE]: { ...style, pStyle: lvl } }, getImageStepTwoParamsFn, options);
  return result;
};
