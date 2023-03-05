import type { HtmlJsonNode } from '@iimm/shared';
import type { HtmlJsonNodeParserOptions, GetImageStepTwoParamsFn } from '@/types/index';

import { paragraphHtmlJsonNodeParser } from '../paragrahParse';

let listNumId = 0;
export const getListNumId = () => {
  listNumId = listNumId + 1;
  return listNumId;
};

const parseLi = async (li: HtmlJsonNode, lvl = 0, listnumId: number, result = [], getImageStepTwoParamsFn?: GetImageStepTwoParamsFn, options?: HtmlJsonNodeParserOptions) => {
  const { NODENAME = 'name', CHILDREN = 'elements', STYLE = 'style', listExtraStyleGenerateFn } = options || {};
  const { [STYLE]: style = {}, [CHILDREN]: children } = li;
  const ou = [];
  for (let i = 0; i < children.length; i++) {
    if (children[i]?.[NODENAME] === 'ol' || children[i]?.[NODENAME] === 'ul') {
      ou.push(i);
    }
  }
  const thisLvlStyle = listExtraStyleGenerateFn?.(lvl, li[NODENAME]) ?? (lvl ? {
    'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd`,
  } : { 'mso-char-indent-count': 2 });
  if (ou.length) {
    let start = 0;
    let end = 0;
    const nextLvlStyle = listExtraStyleGenerateFn?.(lvl + 1, li[NODENAME], true) ?? { 'mso-char-indent-count': `-${lvl + 1}.0`, 'mso-para-margin-left': `${lvl}.0gd` };
    for (let i = 0; i < ou.length; i++) {
      end = ou[i];
      /** 在上级列表中 */
      if (end > start) {
        const p = await paragraphHtmlJsonNodeParser({ ...li, [CHILDREN]: children.slice(start, end), [STYLE]: { ...style,
          // listLvl: lvl,
          // listNumId,
          ...thisLvlStyle,
        } }, getImageStepTwoParamsFn, options);
        if (p.length) result.push(p[0]);
      }
      /** 下级列表 */
      const lis = children[end]?.[CHILDREN];
      if (lis?.length) {
        const listItemId = getListNumId();
        for (let j = 0; j < lis.length; j++) {
          const ele = lis[j];
          await parseLi({ ...ele, [STYLE]: { ...ele[STYLE] || {}, ...nextLvlStyle } }, lvl + 1, listItemId, result, getImageStepTwoParamsFn, options);
        }
      }
      start = end + 1;
    }
    /** 在上级列表中 */
    if (start < children.length) {
      const p = await paragraphHtmlJsonNodeParser({ ...li, [CHILDREN]: children.slice(start), [STYLE]: { ...style,
        // listLvl: lvl,
        // listnumId,
        ...thisLvlStyle,
      } }, getImageStepTwoParamsFn, options);
      if (p.length) result.push(p[0]);
    }
  } else {
    const p = await paragraphHtmlJsonNodeParser({ ...li, [STYLE]: {
      ...style,
      ...thisLvlStyle,
      // listLvl: lvl,
      // listNumId,
    } }, getImageStepTwoParamsFn, options);
    if (p.length) result.push(p[0]);
  }
};
// 处理有序列表或无序列表，直接按悬挂缩进2个字符的段落处理，不会获得任何样式
export const listHtmlJsonNodeParser = async (node?: HtmlJsonNode, getImageStepTwoParamsFn?: GetImageStepTwoParamsFn, options?: HtmlJsonNodeParserOptions) => {
  const { CHILDREN = 'elements', STYLE = 'style' } = options || {};
  const { [CHILDREN]: children, [STYLE]: style = {} } = node;
  const result = [];
  const listNumId = getListNumId();
  for (let i = 0; i < children.length; i++) {
    const li = children[i];
    await parseLi(li, style?.listLvl ?? 0, listNumId, result, getImageStepTwoParamsFn, options);
  }
  return result;
};
