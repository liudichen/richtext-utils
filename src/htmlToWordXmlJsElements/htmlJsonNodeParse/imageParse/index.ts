import type { HtmlJsonNode } from "@iimm/shared";
import type { HtmlJsonNodeParserOptions, HtmlXmlParamsImageNodeStepOne, GetImageStepTwoParamsFn } from "@/types/index";

// 获取图片的阶段1的参数，后续还需要处理图片rId或获取图片尺寸
const getImageElementStepOneParamsFromHtmlAttributes = (params: {
  src?: string;
  width?: string | number;
  height?: string | number;
}) => {
  const { src, width, height } = params;
  if (!src || !src?.trim?.()) return null;
  if (src.startsWith("file:/")) return null;
  const data: HtmlXmlParamsImageNodeStepOne = { type: "image", step: 0, src };
  if (+width > 0 && +height > 0) {
    // 转化为xml里的cx,cy
    const rate = 9525;
    data.cx = Math.round(+width * rate);
    data.cy = Math.round(+height * rate);
  }
  return data;
};

export const imageHtmlJsonNodeParser = async (
  node: HtmlJsonNode,
  getImageStepTwoParamsFn?: GetImageStepTwoParamsFn,
  options?: HtmlJsonNodeParserOptions
) => {
  const { STYLE = "style", ATTRIBUTES = "attributes" } = options || {};
  const { [ATTRIBUTES]: attrs = {}, [STYLE]: style } = node;
  const imgStepOneNode = getImageElementStepOneParamsFromHtmlAttributes({ type: "image", ...attrs, style });
  if (!imgStepOneNode) return null;
  if (!getImageStepTwoParamsFn) throw new Error("必须传递getImageStepTwoParamsFn函数");
  const imgStepTwoPrams = await getImageStepTwoParamsFn?.(imgStepOneNode);
  if (!imgStepTwoPrams || !imgStepTwoPrams.rId) throw new Error("getImageStepTwoParamsFn函数处理后无输出或缺少rId参数");
  return { ...imgStepTwoPrams, type: "image" };
};
