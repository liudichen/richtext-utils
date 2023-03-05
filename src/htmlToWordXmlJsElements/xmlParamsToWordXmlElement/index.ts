import type { HtmlXmlParamsNode, XmlElementGenerationConfig } from '@/types/index';

import { imageXmlParamsNodeToXmlElementObj } from './imageNode';
import { paragraphXmlParamsNodeToXmlElementObj } from './paragraphNode';
import { tableXmlParamsNodeToXmlElementObj } from './tableNode';

/** 将1个解析后的xml参数的节点转换为本包配置的xml-js准备转化回xml的js对象(注意table会在后面插个空段落，所以是数组) */
export const xmlParamsNodeToXmlElementObj = (node: HtmlXmlParamsNode, config: XmlElementGenerationConfig) => {
  const { type } = node;
  if (type === 'p') {
    return paragraphXmlParamsNodeToXmlElementObj(node, config);
  } else if (type === 'image') {
    return imageXmlParamsNodeToXmlElementObj(node, config);
  } else if (type === 'table') {
    return tableXmlParamsNodeToXmlElementObj(node, config);
  }
};
