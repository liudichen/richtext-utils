import type { HtmlJsonNode } from '@iimm/shared';
import type { HtmlJsonNodeParserOptions, GetImageStepTwoParamsFn } from '@/types/index';

import { paragraphHtmlJsonNodeParser } from './paragrahParse';
import { imageHtmlJsonNodeParser } from './imageParse';
import { listHtmlJsonNodeParser } from './listParse';
import { headHtmlJsonNodeParser } from './headParse';
import { tableHtmlJsonNodeParser } from './tableParse';

export const ignoreTags = [ 'o:p', 'figcaption' ];

/** 将已经转换成js的html节点数组转换为生成xml所需要的参数
 * @param node 节点
 * @param getImageStepTwoParamsFn 内容中有图片的话必须，用来处理图片的rId和保存图片等
 * @param options 配置
*/
export const htmlJsonNodeParser = async (node: HtmlJsonNode, getImageStepTwoParamsFn?: GetImageStepTwoParamsFn, options?: HtmlJsonNodeParserOptions) => {
  const { NODENAME = 'name', NODETAG = 'element', CHILDREN = 'elements' } = options || {};

  const { type, [NODENAME]: tagName, [CHILDREN]: children } = node;
  if (type === NODETAG && ignoreTags.includes(tagName)) { return false; }
  if (tagName === 'figure') {
    const childs = children.filter((ele) => !/^fig/.test(ele[NODENAME]));
    if (!childs.length) return false;
    if (!childs.find((ele) => ele[NODENAME] === 'p' || ele[NODENAME] === 'table')) {
      return await paragraphHtmlJsonNodeParser(node, getImageStepTwoParamsFn, options);
    }
    const data = [];
    for (let i = 0; i < childs.length; i++) {
      const ele = childs[i];
      let res = await htmlJsonNodeParser(ele, getImageStepTwoParamsFn, options);
      if (res) {
        if (!Array.isArray(res)) {
          data.push(res);
        } else {
          res = res.filter(Boolean);
          if (res.length) data.push(...res);
        }
      }
    }
    return data.length ? data : false;
  }
  if (tagName === 'p') return await paragraphHtmlJsonNodeParser(node, getImageStepTwoParamsFn, options);
  if (tagName === 'table') return await tableHtmlJsonNodeParser(node, getImageStepTwoParamsFn, options);
  if (tagName === 'img') return await imageHtmlJsonNodeParser(node, getImageStepTwoParamsFn, options);
  if (tagName === 'ul' || tagName === 'ol') return await listHtmlJsonNodeParser(node, getImageStepTwoParamsFn, options);
  if (tagName && /^h[1-6]$/.test(tagName)) return await headHtmlJsonNodeParser(node, getImageStepTwoParamsFn, options);
};
