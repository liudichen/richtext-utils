/** 将html转换为约定格式的word xml格式对应的js对象 */
import { htmlToJson, type HtmlJsonNode } from "@iimm/shared";

import type {
  GetImageStepTwoParamsFn,
  HtmlJsonNodeParserOptions,
  HtmlXmlParamsNode,
  XmlElementGenerationConfig,
  XmlNode,
} from "@/types/index";

import { htmlJsonNodeParser } from "./htmlJsonNodeParse";
import { xmlParamsNodeToXmlElementObj } from "./xmlParamsToWordXmlElement";

const defaultSelfCloseTags = ["br", "hr", "img"];

const defaultReg1 = new RegExp(`</(${defaultSelfCloseTags.join("|")})>`, "g");
const defaultReg2 = new RegExp(`<(${defaultSelfCloseTags.join("|")})([^>]*)>`, "g");

/**将自闭和标签转换为闭合标签
 * @param str 待转换字符串
 * @param selfCloseTags 自定义自闭合标签(默认值：["br", "hr", "img"])
 */
export const convertSelfCloseTagsToClosed = (
  /**待转换字符串 */
  str: string,
  /**
   * 自定义自闭合标签
   * @default ["br", "hr", "img"]
   */
  selfCloseTags?: string[]
) => {
  if (typeof str !== "string" || !str?.length || (!!selfCloseTags && !selfCloseTags?.length)) return str;

  let reg1 = defaultReg1;
  let reg2 = defaultReg2;
  if (Array.isArray(selfCloseTags) && selfCloseTags.length > 0) {
    reg1 = new RegExp(`</(${selfCloseTags.join("|")})>`, "g");
    reg2 = new RegExp(`<(${selfCloseTags.join("|")})([^>]*)>`, "g");
  }
  return str.replace(reg1, "").replace(reg2, function (_match, p1, p2: string) {
    let result: string = "<" + p1;
    if (p2) {
      result += p2;
    }
    if (!p2 || !p2.endsWith("/")) {
      result += "/";
    }
    result += ">";
    return result;
  });
};

/** 将htmlJson转换为待生成xml对象的参数节点 */
const htmlJsonToXmlParamsNodes = async (
  htmlJson: HtmlJsonNode | HtmlJsonNode[],
  getImgStepTwoParamsFn?: GetImageStepTwoParamsFn,
  options: HtmlJsonNodeParserOptions = {}
) => {
  const jsonArr = Array.isArray(htmlJson) ? htmlJson : htmlJson ? [htmlJson] : [];
  const data: HtmlXmlParamsNode[] = [];
  for (let i = 0; i < jsonArr.length; i++) {
    let node = await htmlJsonNodeParser(jsonArr[i], getImgStepTwoParamsFn, options);
    if (!node) continue;
    if (Array.isArray(node)) {
      // 有一定的可能性是2层数组（figure导致的）
      node = node.filter(Boolean);
      const arr: HtmlXmlParamsNode[] = [];
      for (let j = 0; j < node.length; j++) {
        const nn = node[j];
        if (Array.isArray(nn)) {
          arr.push(...nn.filter(Boolean));
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
const htmlToWordXmlJsElements = async (
  htmlStr: string,
  getImgStepTwoParamsFn?: GetImageStepTwoParamsFn,
  htmlToXmlParamNodesOptions: HtmlJsonNodeParserOptions = {},
  xmlParamsNodeToXmlElementConfig: XmlElementGenerationConfig = {}
) => {
  const { selfCloseTags, ...rest } = htmlToXmlParamNodesOptions || {};
  const jsonArr = htmlToJson(convertSelfCloseTagsToClosed(htmlStr, selfCloseTags), {
    skipComment: true,
    skipClass: true,
    skipScript: true,
    keepInlineStyle: true,
    skipStyle: false,
    skipAttributes: false,
    styleCamelCase: rest?.styleCamelCase || false,
    attributesCamelCase: rest.attributesCamelCase || false,
  });
  const paramsNodes = await htmlJsonToXmlParamsNodes(jsonArr, getImgStepTwoParamsFn, rest);
  const elements: XmlNode[] = [];
  for (let i = 0; i < paramsNodes.length; i++) {
    const item = paramsNodes[i] as HtmlXmlParamsNode[] | HtmlXmlParamsNode;
    const nodes: HtmlXmlParamsNode[] = Array.isArray(item) ? [...item] : [item];
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
  htmlJsonToXmlParamsNodes,
  htmlToWordXmlJsElements,
  htmlToJson,
};

export { paragraphXmlParamsNodeToXmlElementObj } from "./xmlParamsToWordXmlElement/paragraphNode";

export { textXmlParamsNodeToXmlElementObj } from "./xmlParamsToWordXmlElement/textNode";

export { imageXmlParamsNodeToXmlElementObj } from "./xmlParamsToWordXmlElement/imageNode";
