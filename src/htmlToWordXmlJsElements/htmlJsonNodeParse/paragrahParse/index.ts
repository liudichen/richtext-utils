import type { HtmlJsonNode, ObjectStyle } from "@iimm/shared";
import type {
  HtmlJsonNodeParserOptions,
  HtmlXmlParamsParagrapNode,
  GetImageStepTwoParamsFn,
  HtmlXmlParamsTextNode,
} from "@/types/index";
import {
  htmlSpacingSizeToWordSizeNumber,
  htmlFontSizeToWordFontSizeNumber,
  splitHtmlMarginString,
  getFontFamilyFromObjectStyle,
  htmlColorToWordColor,
  getLangFromObjectStyle,
} from "@/utils/index";

import { imageHtmlJsonNodeParser } from "../imageParse";
import { spanHtmlJsonNodeParser } from "../spanParse";

/** 从段落的style属性(已转化成了对象)获取段落格式参数 */
export const getParagraphParamsFromStyle = (styles: ObjectStyle = {}, onlyHans = true, styleCamelCase = false) => {
  const data: HtmlXmlParamsParagrapNode = { type: "p" };
  const keys = Object.keys(styles);
  if (!keys.length) return data;
  if (styles?.pStyle) data.pStyle = styles.pStyle as string;
  if (keys.includes("listLvl")) data.listLvl = styles.listLvl;
  if (keys.includes("listNumId")) data.listNumId = styles.listNumId;
  // === w:pPr -> w:spacing ======
  const lineHeightStr = styleCamelCase ? "lineHeight" : "line-height";
  if (keys.includes(lineHeightStr)) {
    let lineHeight = styles[lineHeightStr];
    if (+lineHeight) lineHeight = `${Math.round(+lineHeight * 100)}%`;
    data.line = htmlSpacingSizeToWordSizeNumber(lineHeight);
    if (styles[styleCamelCase ? "lineHeightRule" : "line-height-rule"] === "exactly") data.lineRuleExact = true;
  }
  const mMtStr = styleCamelCase ? "msoParaMarginTop" : "mso-para-margin-top";
  if (keys.includes(mMtStr)) {
    data.beforeLines = htmlSpacingSizeToWordSizeNumber(styles[mMtStr]);
  }
  const mtStr = styleCamelCase ? "marginTop" : "margin-top";
  if (keys.includes(mtStr)) {
    data.before = htmlSpacingSizeToWordSizeNumber(styles[mtStr]);
  }
  const mMbStr = styleCamelCase ? "msoParaMarginBottom" : "mso-para-margin-bottom";
  if (keys.includes(mMbStr)) {
    data.afterLines = htmlSpacingSizeToWordSizeNumber(styles[mMbStr]);
  }
  const mbStr = styleCamelCase ? "marginBottom" : "margin-bottom";
  if (keys.includes(mbStr)) {
    data.after = htmlSpacingSizeToWordSizeNumber(styles[mbStr]);
  }
  // ====================
  // ===============
  // ===== w:pPr -> w:rPr -> w:sz/w:szCs
  let fontSize: number;
  const fsStr = styleCamelCase ? "fontSize" : "font-size";
  if (keys.includes(fsStr)) {
    fontSize = htmlFontSizeToWordFontSizeNumber(styles[fsStr]);
    if (fontSize) data.fontSize = fontSize;
  }
  // ============================
  // ===== w:pPr -> w:ind =====
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [t, r, b, l] = splitHtmlMarginString(styles.margin).map((item) => htmlSpacingSizeToWordSizeNumber(item));
  const mMlStr = styleCamelCase ? "msoParaMarginLeft" : "mso-para-margin-left";
  const mlStr = styleCamelCase ? "marginLeft" : "margin-left";
  if (keys.includes(mMlStr)) {
    const value = styles[mMlStr];
    const wordValue = htmlSpacingSizeToWordSizeNumber(value, fontSize);
    if (typeof value === "string" && (value.endsWith("gd") || value.endsWith("em"))) {
      data.leftChars = Math.round(+value.slice(0, value.length - 2) * 100);
      if (!keys.includes(mlStr) && !l) {
        data.left = Math.round((wordValue / 100) * 210);
      }
    } else {
      data.left = wordValue;
    }
  }
  if (keys.includes(mlStr)) {
    data.left = htmlSpacingSizeToWordSizeNumber(styles[mlStr], fontSize);
  } else if (l) {
    data.left = l;
  }
  const mMrStr = styleCamelCase ? "msoParaMarginRight" : "mso-para-margin-right";
  const mrStr = styleCamelCase ? "marginRight" : "margin-right";
  if (keys.includes(mMrStr)) {
    const value = styles[mMrStr];
    const wordValue = htmlSpacingSizeToWordSizeNumber(value, fontSize);
    if (typeof value === "string" && (value.endsWith("gd") || value.endsWith("em"))) {
      data.rightChars = Math.round(+value.slice(0, value.length - 2) * 100);
      if (!keys.includes(mrStr) && !r) {
        data.right = Math.round((wordValue / 100) * 210);
      }
    } else {
      data.right = wordValue;
    }
  }
  if (keys.includes(mrStr)) {
    data.right = htmlSpacingSizeToWordSizeNumber(styles[mrStr], fontSize);
  } else if (r) {
    data.left = r;
  }
  const indentStr = styleCamelCase ? "textIndent" : "text-indent";
  if (keys.includes(indentStr)) {
    const value = styles[indentStr];
    const wordValue = htmlSpacingSizeToWordSizeNumber(value, fontSize);
    if (wordValue) {
      if (typeof value === "string" && (value.endsWith("gd") || value.endsWith("em"))) {
        if (wordValue > 0) {
          data.firstLineChars = Math.round(+value.slice(0, value.length - 2) * 100);
          data.firstLine = Math.round((wordValue / 100) * 210);
        } else {
          data.hangingChars = Math.round(+value.slice(0, value.length - 2) * -100);
          data.hanging = Math.round((wordValue / 100) * -210);
        }
      } else {
        if (wordValue > 0) {
          data.firstLine = wordValue;
        } else {
          data.hanging = -wordValue;
        }
      }
    }
  }
  const mCharIndentStr = styleCamelCase ? "msoCharIndentCount" : "mso-char-indent-count";
  if (keys.includes(mCharIndentStr)) {
    const value = +styles[mCharIndentStr];
    if (value > 0) {
      data.firstLineChars = value * 100;
      if (typeof data.firstLine === "undefined")
        data.firstLine = fontSize ? Math.round(value * fontSize * 20) : Math.round(value * 210);
    } else if (value < 0) {
      data.hangingChars = Math.round(value * -100);
      if (typeof data.hanging === "undefined")
        data.hanging = fontSize ? Math.round(value * fontSize * -20) : Math.round(value * -210);
    }
  }
  // ========================
  // ====== w:pPr -> w:jc
  const alignStr = styleCamelCase ? "textAlign" : "text-align";
  if (keys.includes(alignStr)) {
    const align = styles[alignStr];
    if (align === "right" || align === "center" || align === "left") {
      data.align = align;
    } else if (
      align === "justify" &&
      (styles[styleCamelCase ? "textAlignLast" : "text-align-last"] === "justify" ||
        styles[styleCamelCase ? "textJustify" : "text-justify"] === "distribute-all-lines")
    ) {
      data.align = "distribute";
    }
  }

  // ========== w:pPr -> w:rPr -> w:rFonts 暂时仅保留汉语字体
  const { fontFamily, fonts } = getFontFamilyFromObjectStyle(styles as ObjectStyle<string>, onlyHans, styleCamelCase);
  if (fontFamily) data.fontFamily = fontFamily;
  if (fonts) data.fonts = fonts;
  if (styles.color) {
    const color = htmlColorToWordColor(styles.color as string);
    if (color) data.color = color;
  }
  const kernStr = styleCamelCase ? "msoFontKerning" : "mso-font-kerning";
  if (styles[kernStr]) {
    const kern = htmlSpacingSizeToWordSizeNumber(kernStr);
    if (kern) {
      data.kern = kern;
    }
  }
  const { lang, bidiLang } = getLangFromObjectStyle(styles, styleCamelCase);
  if (lang) data.lang = lang;
  if (bidiLang) data.bidiLang = bidiLang;
  return data;
};

export const paragraphHtmlJsonNodeParser = async (
  node: HtmlJsonNode,
  getImageStepTwoParamsFn?: GetImageStepTwoParamsFn,
  options?: HtmlJsonNodeParserOptions
) => {
  const {
    NODENAME = "name",
    TEXTTAG = "text",
    TEXTVALUE = "text",
    CHILDREN = "elements",
    STYLE = "style",
    onlyHans = true,
    styleCamelCase = false,
  } = options || {};
  const { [CHILDREN]: children, [STYLE]: style = {}, [NODENAME]: pTagName } = node;
  const data = [];
  let imgFirst = true;
  const paragraphParams = getParagraphParamsFromStyle(style, onlyHans, styleCamelCase);
  let items = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const { [NODENAME]: tagName, type, [TEXTVALUE]: text } = child;
    if (type === TEXTTAG) {
      items.push({ ...paragraphParams, type, text });
      if (!data.length) imgFirst = false;
    }
    if (tagName === "span" || ["b", "strong", "em", "i", "u", "s", "sub", "sup"].includes(tagName)) {
      const result = [];
      /** 将段落的字体和字号向下作为默认值传递给下面的span节点 */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...parentStyle } = paragraphParams;
      await spanHtmlJsonNodeParser(
        child,
        {},
        parentStyle as HtmlXmlParamsTextNode,
        result,
        getImageStepTwoParamsFn,
        pTagName === "li" ? paragraphParams : undefined,
        options
      );
      items.push(...result);
      if (!data.length) imgFirst = false;
    } else if (tagName === "img") {
      // 内联图片可以任务是p的子元素
      const imgNode = await imageHtmlJsonNodeParser(child, getImageStepTwoParamsFn, options);
      if (imgNode) {
        items.push(imgNode);
      }
    }
  }
  // 清除没有文本内容的 text子项
  items = items.filter((ele) => ele.type !== TEXTTAG || ele[TEXTVALUE] !== "");
  if (imgFirst || !data.length) {
    data.push({ ...paragraphParams, items });
  } else {
    data.unshift({ ...paragraphParams, items });
  }
  return data;
};

// const ParagraphRelateStyleKeys = [
//   'line-height', 'line-height-rule',
//   'margin',
//   'mso-para-margin-top', 'margin-top',
//   'mso-para-margin-bottom', 'margin-bottom',
//   'mso-para-margin-right', 'mso-para-margin-left',
//   'text-indent',
//   'mso-char-indent-count',
//   'font-family', 'mso-hansi-font-family', 'mso-ascii-font-family', 'mso-bidi-font-family', 'mso-fareast-font-family',
//   'font-size',
//   'text-align', 'text-justify', 'text-align-last',
//   'mso-list', // 实际标签是li
// ]
