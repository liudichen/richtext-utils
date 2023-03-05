/** 将html转换为约定格式的word xml格式对应的js对象 */
import { htmlToJson } from '@iimm/shared';

import type { GetImageStepTwoParamsFn, HtmlJsonNodeParserOptions, HtmlXmlParamsNode, XmlElementGenerationConfig, XmlNode } from '@/types/index';

import { htmlJsonNodeParser } from './htmlJsonNodeParse';
import { xmlParamsNodeToXmlElementObj } from './xmlParamsToWordXmlElement';

/** 将html字符串转换为待生成xml对象的参数节点 */
const htmlToXmlParamsNodes = async (htmlStr: string, getImgStepTwoParamsFn?: GetImageStepTwoParamsFn, options: HtmlJsonNodeParserOptions = {}) => {
  const jsonArr = htmlToJson(htmlStr, { skipComment: true, skipClass: true, skipScript: true, keepInlineStyle: false, skipStyle: false, skipAttributes: false, styleCamelCase: options?.styleCamelCase || false, attributesCamelCase: options?.attributesCamelCase || false });
  const data: HtmlXmlParamsNode[] = [];
  for (let i = 0; i < jsonArr.length; i++) {
    let node = await htmlJsonNodeParser(jsonArr[i], getImgStepTwoParamsFn, options);
    if (!node) continue;
    if (Array.isArray(node)) { // 有一定的可能性是2层数组（figure导致的）
      node = node.filter(Boolean);
      const arr: HtmlXmlParamsNode[] = [];
      for (let j = 0; j < node.length; j++) {
        const nn = node[j];
        if (Array.isArray(nn)) {
          arr.push(...(nn.filter(Boolean)));
        } else {
          if (nn) {
            arr.push(nn as HtmlXmlParamsNode);
          }
        }
      }
      if (arr.length) {
        data.push(...arr);
      }
    } else {
      data.push(node as HtmlXmlParamsNode);
    }
  }
  return data;
};


/** 将html字符串转换为word的xml对象数组
 * @param htmlStr html字符串
 * @param getImgStepTwoParamsFn 用于处理图片转xml属性的函数，如果有图片不传此函数则会报错
 * @param htmlToXmlParamNodesOptions html字符串转生成xml对象的参数节点时的配置
 * @param xmlParamsNodeToXmlElementConfig 待生成xml对象的参数节点生成xml对应的js对象时的配置
 */
const htmlToWordXmlJsElements = async (htmlStr: string, getImgStepTwoParamsFn?: GetImageStepTwoParamsFn, htmlToXmlParamNodesOptions: HtmlJsonNodeParserOptions = {}, xmlParamsNodeToXmlElementConfig: XmlElementGenerationConfig = {}) => {
  const paramsNodes = await htmlToXmlParamsNodes(htmlStr, getImgStepTwoParamsFn, htmlToXmlParamNodesOptions);
  const elements: XmlNode[] = [];
  for (let i = 0; i < paramsNodes.length; i++) {
    const item = paramsNodes[i] as (HtmlXmlParamsNode[] | HtmlXmlParamsNode);
    const nodes: HtmlXmlParamsNode[] = Array.isArray(item) ? [ ...item ] : [ item ];
    for (let j = 0; j < nodes.length; j++) {
      const node = nodes[j];
      const xmlElements = xmlParamsNodeToXmlElementObj(node, xmlParamsNodeToXmlElementConfig);
      if (xmlElements) {
        if (Array.isArray(xmlElements)) {
          elements.push(...xmlElements);
        } else {
          elements.push(xmlElements);
        }
      }
    }
  }
  return elements;
};

export {
  htmlJsonNodeParser,
  xmlParamsNodeToXmlElementObj,
  htmlToXmlParamsNodes,
  htmlToWordXmlJsElements,
  htmlToJson,
};
