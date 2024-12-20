import { type HtmlJsonNode, camelCase } from "@iimm/shared";
import type {
  HtmlJsonNodeParserOptions,
  GetImageStepTwoParamsFn,
  HtmlXmlParamsTableNode,
  XmlTableBorder,
  HtmlXmlParamsTableCell,
  HtmlXmlParamsTableRow,
  XmlTableCellBorders,
  HtmlXmlParamsParagrapNode,
  HtmlXmlParamsImageNode,
} from "@/types/index";
import { htmlSpacingSizeToWordSizeNumber, htmlColorToWordColor } from "@/utils/index";

import { paragraphHtmlJsonNodeParser } from "../paragrahParse";
import { htmlJsonNodeParser } from "..";

/** <td>中 width数字与xml中数值的缩放比例,误差小 */
const tableAttributeWidthRate = 15;

export const WordTableBorderStyle = [
  "solid",
  "dashed",
  "dotted",
  "dash-small-gap",
  "double",
  "dot-dot-dash",
  "triple",
  "dot-dash",
  "thin-thick-small-gap",
  "thick-thin-small-gap",
  "thin-thick-thin-small-gap",
  "thick-thin-medium-gap",
  "thin-thick-large-gap",
  "thin-thick-thin-large-gap",
  "double-wave",
  "wave",
  "dash",
  "dash-dot-stroked",
  "ridge",
  "groove",
  "three-d-emboss",
  "three-d-engrave",
];

const defaultBorder: XmlTableBorder = {
  color: "auto",
  sz: 2,
  val: "single",
  space: 0,
};
const borderStyleParse = (borderStr: string, DefaultInfo: XmlTableBorder = {}) => {
  const border: XmlTableBorder = {};
  if (borderStr === "none") {
    border.val = "nil";
    return border;
  }
  const values = borderStr.split(/\s+/).filter(Boolean);
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (/[\.0-9]/.test(value)) {
      border.sz = value.endsWith("pt") ? +value.slice(0, -2) * 4 : +value || 2;
    } else if (WordTableBorderStyle.includes(value)) {
      border.val = value === "solid" ? "single" : camelCase(value);
    } else {
      if (value === "windowtext") {
        border.color = "auto";
      } else {
        border.color = htmlColorToWordColor(value);
      }
    }
  }
  if (!border.color) {
    border.color = DefaultInfo?.color || "auto";
  }
  if (!border.sz) {
    border.sz = DefaultInfo?.sz;
  }
  if (!border.val) {
    border.val = DefaultInfo?.val;
  }
  return border;
};

const getTableBordersFromStylesAndAttributes = (
  styles: { [key: string]: string },
  attributes?: { [key: string]: string },
  styleCamelCase = false
) => {
  const borders: HtmlXmlParamsTableNode["borders"] = {};
  const mStr = styleCamelCase ? "msoBorderAlt" : "mso-border-alt";
  if (styles[mStr]) {
    borders.top =
      borders.left =
      borders.right =
      borders.bottom =
      borders.insideH =
      borders.insideV =
        borderStyleParse(styles[mStr]);
  } else if (attributes?.border) {
    borders.top = { ...defaultBorder };
    borders.left = { ...defaultBorder };
    borders.right = { ...defaultBorder };
    borders.bottom = { ...defaultBorder };
    borders.insideH = { ...defaultBorder };
    borders.insideV = { ...defaultBorder };
    return borders;
  }
  const mTStr = styleCamelCase ? "msoBorderTopAlt" : "mso-border-top-alt";
  const mBStr = styleCamelCase ? "msoBorderBottomAlt" : "mso-border-bottom-alt";
  const mRStr = styleCamelCase ? "msoBorderRightAlt" : "mso-border-right-alt";
  const mLStr = styleCamelCase ? "msoBorderTopAlt" : "mso-border-top-alt";
  const mHStr = styleCamelCase ? "msoBorderInsideh" : "mso-border-insideh";
  const mVStr = styleCamelCase ? "msoBorderInsidev" : "mso-border-insidev";
  if (styles[mTStr]) {
    borders.top = borderStyleParse(styles[mTStr]);
  }
  if (styles[mBStr]) {
    borders.bottom = borderStyleParse(styles[mBStr]);
  }
  if (styles[mRStr]) {
    borders.right = borderStyleParse(styles[mRStr]);
  }
  if (styles[mLStr]) {
    borders.left = borderStyleParse(styles[mLStr]);
  }
  if (styles[mHStr]) {
    borders.insideH = borderStyleParse(styles[mHStr]);
  }
  if (styles[mVStr]) {
    borders.insideV = borderStyleParse(styles[mVStr]);
  }
  if (Object.keys(borders).length) return borders;
};

const getCellBorderFromStyles = (
  styles: { [key: string]: string },
  styleCamelCase = false,
  DefaultInfo: XmlTableCellBorders = {}
) => {
  const borders: XmlTableCellBorders = {};
  let commonColor = styles[styleCamelCase ? "msoBorderColorAlt" : "mso-border-color-alt"];
  if (commonColor) {
    commonColor = commonColor === "windowtext" ? "auto" : htmlColorToWordColor(commonColor);
  }
  let commmonStyle: XmlTableBorder = {};
  const commonStyleStr = styles[styleCamelCase ? "msoBorderAlt" : "mso-border-alt"];
  if (commonStyleStr) commmonStyle = borderStyleParse(commonStyleStr);
  const directions = ["top", "bottom", "right", "left"];
  for (let i = 0; i < directions.length; i++) {
    const direction = directions[i];
    const alt = styles[styleCamelCase ? camelCase(`mso-border-${direction}-alt`) : `mso-border-${direction}-alt`];
    if (alt) {
      const border = borderStyleParse(alt);
      if (!border.color) border.color = commonColor || commmonStyle?.color || DefaultInfo?.[direction]?.color;
      borders[direction] = border;
    }
  }
  if (Object.keys(borders).length) return borders;
};

const tabelCellContentParser = async (
  content: HtmlJsonNode[],
  getImageStepTwoParamsFn?: GetImageStepTwoParamsFn,
  options: HtmlJsonNodeParserOptions = {}
) => {
  const { NODENAME = "name", CHILDREN = "elements", STYLE = "style" } = options || {};
  let data = [];
  if (!content.length || content.filter((ele) => ele[NODENAME] === "span").length === content.length) {
    data = await paragraphHtmlJsonNodeParser(
      { type: "p", [STYLE]: {}, [CHILDREN]: content },
      getImageStepTwoParamsFn,
      options
    );
  } else {
    for (let i = 0; i < content.length; i++) {
      const ele = content[i];
      const cellNode = await htmlJsonNodeParser(ele, getImageStepTwoParamsFn, options);
      if (Array.isArray(cellNode)) {
        data.push(...cellNode);
      } else {
        data.push(cellNode);
      }
    }
  }
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (Array.isArray(node)) {
      result.push(...node);
    } else {
      result.push(node);
    }
  }
  return result.filter(Boolean) as (HtmlXmlParamsImageNode | HtmlXmlParamsTableNode | HtmlXmlParamsParagrapNode)[];
};

export const tableHtmlJsonNodeParser = async (
  node: HtmlJsonNode,
  getImageStepTwoParamsFn?: GetImageStepTwoParamsFn,
  options: HtmlJsonNodeParserOptions = {}
) => {
  const {
    NODENAME = "name",
    CHILDREN = "elements",
    STYLE = "style",
    ATTRIBUTES = "attributes",
    styleCamelCase = false,
  } = options || {};
  const { [CHILDREN]: blocks = [], [STYLE]: style = {}, [ATTRIBUTES]: attributes = {} } = node;
  const gridCols = [];
  let TRs = [];
  const thead: HtmlJsonNode = blocks.find((ele: HtmlJsonNode) => ele[NODENAME] === "thead");
  const tbody: HtmlJsonNode = blocks.find((ele: HtmlJsonNode) => ele[NODENAME] === "tbody");
  const tfoot: HtmlJsonNode = blocks.find((ele: HtmlJsonNode) => ele[NODENAME] === "tfoot");
  if (thead?.[CHILDREN]?.length) {
    TRs = [...TRs, ...thead[CHILDREN].map((ele: HtmlJsonNode) => ({ ...ele, isHeader: true }))];
  }
  if (tbody?.[CHILDREN]?.length) {
    TRs = [...TRs, ...tbody[CHILDREN]];
  }
  if (tfoot?.[CHILDREN]?.length) {
    TRs = [...TRs, ...tfoot[CHILDREN].map((ele: HtmlJsonNode) => ({ ...ele, isFooter: true }))];
  }
  if (!TRs.length) return false;
  //  ===== ↓ table 属性 ↓ =====
  const tableData: HtmlXmlParamsTableNode = { type: "table", cols: 0, width: 0 };
  if (attributes?.height || style?.height) {
    tableData.height = +attributes?.height * tableAttributeWidthRate || htmlSpacingSizeToWordSizeNumber(style?.height);
  }
  const borders = getTableBordersFromStylesAndAttributes(style, attributes, styleCamelCase);
  const tableIndStr = styleCamelCase ? "marginLeft" : "margin-left";
  if (style[tableIndStr]) {
    tableData.ind = htmlSpacingSizeToWordSizeNumber(style[tableIndStr]);
  }
  const layoutStr = styleCamelCase ? "msoTableLayoutAlt" : "mso-table-layout-alt";
  if (style[layoutStr]) {
    tableData.layout = style[layoutStr];
  }
  if (borders) tableData.borders = borders;
  const colWidths = [];
  if (+attributes.width) {
    tableData.width = +attributes.width * tableAttributeWidthRate;
  } else if (style.width) {
    tableData.width = Math.round(htmlSpacingSizeToWordSizeNumber(style.width));
  }
  // ==== 计算总列数
  const firstRow = TRs[0];
  for (let i = 0; i < firstRow?.[CHILDREN].length; i++) {
    const { [ATTRIBUTES]: attributes } = firstRow[CHILDREN][i];
    let { colspan } = attributes || {};
    colspan = +colspan || 0;
    tableData.cols = tableData.cols + (colspan > 1 ? colspan : 1);
  }
  // ===============
  if (!tableData.cols) return false;

  /** 行数据 */
  const tableRows: HtmlXmlParamsTableRow[] = TRs.map(() => ({
    type: "tr",
    cells: new Array(tableData.cols),
    widths: [],
  }));
  // =====================
  for (let i = 0; i < TRs.length; i++) {
    const row = TRs[i];
    const { [CHILDREN]: cells, isFooter, isHeader } = row;
    // ====== ↓ tr的自己属性 ↓ ====
    if (isFooter) tableRows[i].isFooter = true;
    if (isHeader) tableRows[i].isHeader = true;
    if (row[STYLE]?.[styleCamelCase ? camelCase("page-break-inside") : "page-break-inside"] === "avoid")
      tableRows[i].cantSplit = true;
    if (row[STYLE]?.height) tableRows[i].height = htmlSpacingSizeToWordSizeNumber(row[STYLE].height);
    // ======= ↑ ↑ =======
    /** 指示单元格实际所在的列坐标 */
    let kNum = 0;
    for (let j = 0; j < cells.length; j++) {
      const { [CHILDREN]: content, [STYLE]: style = {}, [ATTRIBUTES]: attributes } = cells[j];
      const cellData: HtmlXmlParamsTableCell = {};
      const commonData: Pick<HtmlXmlParamsTableCell, "width" | "colspan" | "vAlign"> = {};
      const { [styleCamelCase ? camelCase("vertical-align") : "vertical-align"]: vAlign, width: widthS } = style || {};
      let { colspan, rowspan, width: widthA } = attributes || {};
      // ===== 处理单元格属性 =====
      let width = 0;
      if (+widthA || widthS) {
        width = +widthA * tableAttributeWidthRate || htmlSpacingSizeToWordSizeNumber(widthS);
        commonData.width = width;
      }

      colspan = +colspan || 1;
      rowspan = +rowspan || 1;
      const cellBorders: XmlTableCellBorders = getCellBorderFromStyles(style, styleCamelCase, borders);
      if (cellBorders) cellData.borders = cellBorders;
      if (colspan > 1) commonData.colspan = colspan;
      // 单元格的垂直对齐方式， word里默认是top，html里默认是center,对应th，tc属性的vertical-align:bottom/top，center时style里没有。水平对齐由下面的段落控制。
      if (vAlign !== "top") {
        commonData.vAlign = vAlign || "center";
      }

      if (rowspan > 1) {
        cellData.vMergeRestart = true;
      }
      // ***********************
      // !!!!!!!! 预留位置： 边框处理
      // **********************
      cellData.content = await tabelCellContentParser(content, getImageStepTwoParamsFn, options);
      if (i === 0) {
        gridCols.push(width);
      }
      /** 由于被上方合并的单元格，在当前行的html中是不存在的，所有当前单元格可能位置需要后移 */
      let thisMayMergeCellColNum = kNum;
      while (tableRows[i].cells[thisMayMergeCellColNum]) {
        thisMayMergeCellColNum = thisMayMergeCellColNum + 1;
      }
      tableRows[i].cells[thisMayMergeCellColNum] = { type: "tc", ...commonData, ...cellData };
      tableRows[i].widths.push(width);
      if (rowspan > 1) {
        const mergeData = { ...commonData, vMerge: true };
        for (let k = 1; k < rowspan; k++) {
          tableRows[i + k].cells[kNum] = { type: "tc", ...mergeData };
        }
      }
      kNum = kNum + colspan;
    }
  }
  tableData.rows = tableRows.map((ele) => ({ ...ele, cells: ele.cells.filter(Boolean) }));
  tableData.colWidths = colWidths;
  const maxColsRow = tableRows.find((ele) => ele.widths.filter(Boolean).length === tableData.cols);
  if (maxColsRow) {
    tableData.colWidths = maxColsRow.widths;
    const totalWidth = maxColsRow.widths.reduce((pre, current) => pre + current, 0);
    tableData.width = totalWidth;
  }
  return tableData;
};
