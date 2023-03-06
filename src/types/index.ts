import type { HtmlConvertAttributesConfig } from '@iimm/shared';

/** 根据html转化成的js节点获取xml节点参数的配置项 */
export interface HtmlJsonNodeParserOptions extends HtmlConvertAttributesConfig {
  /** 仅保留中文字体?
   * @default true
   */
  onlyHans?: boolean,
  /** style的属性名为驼峰式?
   * @default false
   */
  styleCamelCase?: boolean,
  /** 其他属性名为驼峰式?
   * @default false
   */
  attributesCamelCase?: boolean,

  /** 列表属性的生成函数 */
  listExtraStyleGenerateFn?: (lvl: number, nodeName?: string, nextLvl?: boolean, index?: number) => { [key: string]: string | number},

}

/** 转化后的xml生成参数节点生成xml对象的配置项 */
export interface XmlElementGenerationConfig {
  /** 缺省字号? (word的xml文件里的一般为2倍的pt值)
   * @default 24(即小四)
  */
  defaultFontSize?: number,
  /** 默认字体
   * @default 宋体
  */
  defaultFontFamily?: string,
  /** 表格的最大宽度值(word解压后的xml文件里的，A4竖版一般可以在10000+)
   * @default undefined
  */
  tableMaxWidth?: number,
  /** 图片的最大cx/cy值(word解压后的xml文件里的，A4一般可以在5500000+)
   * @default undefined
  */
  imageMaxC?: number,
}

/** 经过处理的待转化为xml对象的段落节点 */
export interface HtmlXmlParamsParagrapNode extends WordXmlLang {
  type: 'p',
  /** 行距/行高(style中对应 line-height单位是%时是多倍行距，是pt时为固定行距) */
  line?: number,
  /** 是否时固定行距，如果固定时，style里会有line-height-rule:exactly */
  lineRuleExact?: boolean
  /** 段前距 - xx行时会有此属性 */
  beforeLines?: number,
  /** 段前距 - 只要有段前距都会有该属性*/
  before?: number,
  /** 段后距 - 为xx行时会有此属性 */
  afterLines?: number,
  /** 段后距 - 只要有段前距都会有该属性*/
  after?: number,

  /** 段落整体的左缩进 - 只要段落有左缩进就会有该属性*/
  left?: number,
  /** 段落整体的左缩进 - 为xxx字符时会有该属性 */
  leftChars?: number,
  /** 段落整体的右缩进 - 只要段落有左缩进就会有该属性*/
  right?: number
  /** 段落整体的右缩进 - 为xxx字符时会有该属性 */
  rightChars?: number,
  /** 段落的首行缩进 - 只要有首行缩进时就会有该属性 */
  firstLine?: number,
  /** 段落的首行缩进 - 为xxx字符时会有该属性 */
  firstLineChars?: number,
  /** 段落的悬挂缩进 - 只要有悬挂缩进时就会有该属性 */
  hanging?: number,
  /** 段落的悬挂缩进 - 为xxx字符时会有该属性 */
  hangingChars?: number,

  /** 对齐方式: left/center/right/justify/distribute，对用style为text-align,word默认是两端对齐justify，此时不需要插入内容 */
  align?: 'left'|'center'|'right'|'justify'|'distribute',
  /** 如果有此属性则强制采用此字体
   * @default '宋体''
   */
  fontFamily?: string,
  fonts?: WordXmlFonts,
  fontSize?: number,
  /** 如果没有其他字体定义则全部采用此字体
   * @default '宋体''
   */
  /** 段落预定义样式，如标题等级 */
  pStyle?: string, // 预定义样式名，如标题等级

  /** 有序 */
  listNumId?: number | string,
  listLvl?: number | string,

  items?: (HtmlXmlParamsImageNode | HtmlXmlParamsTextNode | HtmlXmlParamsTableNode)[],

  color?: string,
  kern?: string | number,
}

export interface HtmlXmlParamsImageNodeStepOne {
  type: 'image',
  step: 0,
  cx?: number,
  cy?: number,
  src: string,
}

/** 对应wordXml里的wr:Fonts */
export interface WordXmlFonts {
  /** style中对应 mso-ascii-font-family wr:Fonts对应属性w:ascii */
  asciiFont?: string,
  /** style中对应 mso-ascii-font-family wr:Fonts对应属性w:hAnsi */
  hAnsiFont?: string,
  /** style中对应 mso-ascii-font-family wr:Fonts对应属性w:eastAsia */
  eastAsiaFont?: string,
  /** style中对应 mso-ascii-font-family wr:Fonts对应属性w:cs */
  csFont?: string,
}

/** 对应wordXml里的 w:lang */
export interface WordXmlLang {
  lang?: string,
  /** style中对应 mso-bidi-language w:lang对应属性w:bidi */
  bidiLang?: string,
}

/** 经过处理的待转化为xml对象的图片节点 */
export interface HtmlXmlParamsImageNode {
  type: 'image',
  step?: number,
  cx?: number,
  cy?: number,
  src: string,
  rId: number,
  name?: string,
}

/** 经过处理的待转化为xml对象的文字属性 */
export interface HtmlXmlParamsTextNode extends SpanSpecialStyles, WordXmlLang {
  type?: 'text',
  /** 如果有此属性则强制采用此字体
   * @default '宋体''
   */
  fontFamily?: string,
  fonts?: WordXmlFonts,
  fontSize?: number | string,
  color?: string,
  /** 文本 */
  text?: string,
  /** 文字高亮的背景颜色 */
  backgroundColor?: string,
  // /** 是否有文字底纹 */
  // shd?: boolean,
  /** 字符间距单位是pt */
  kern?: string | number,
}

/** 经过处理待生成xml的单个框线的属性值 */
export interface XmlTableBorder {
  /** 框线宽度,单位是pt */
  sz?: number,
  /** 框线颜色 */
  color?: string,
  /** 框线类型 */
  val?: string,
}

/** 单元格的4个边框属性 */
export interface XmlTableCellBorders {
  top?: XmlTableBorder,
  right?: XmlTableBorder,
  left?: XmlTableBorder,
  bottom?: XmlTableBorder,
}

/** 表格的行属性 */
export interface HtmlXmlParamsTableRow {
  type: 'tr',
  isFooter?: boolean,
  /** 是否是标题行, 标题行的上层是<thead>下层为<th> */
  isHeader?: boolean,
  /** 是否将允许跨页断行关掉(word默认是允许跨页断行的), <tr>的style里有page-break-inside:avoid时为true */
  cantSplit?: boolean,
  height?: number,
  cells: HtmlXmlParamsTableCell[],
  widths?: number[],
}

/** 解析后并转换成xml参数的节点类型(图片/段落/表格) */
export type HtmlXmlParamsNode = HtmlXmlParamsImageNode | HtmlXmlParamsTableNode | HtmlXmlParamsParagrapNode;

/** 表格的单元格属性 */
export interface HtmlXmlParamsTableCell {
  type?: 'tc',
  width?: number,
  borders?: XmlTableCellBorders,
  vMergeRestart?: boolean,
  /** 水平单元格合并(仅合并时有此参数) */
  colspan?: number,
  /** 单元格的垂直对齐方式， word里默认是top，html里默认是center,对应th，tc属性的vertical-align:bottom/top，center时style里没有。水平对齐由下面的段落控制 */
  vAlign?: 'center' | 'bottom',
  vMerge?: boolean,
  content?: (HtmlXmlParamsNode)[],
}

/** 经过处理的待转化为xml对象的表格节点 */
export interface HtmlXmlParamsTableNode {
  type: 'table',
  cols: number,
  width?: number,
  height?: number,
  colWidths?: number[],
  layout?: 'fixed',
  align?: 'left' | 'center' | 'right',
  ind?: string | number,
  borders?: XmlTableCellBorders & {
    insideH?: XmlTableBorder,
    insideV?: XmlTableBorder
  },
  rows?: HtmlXmlParamsTableRow[]
}

/** 经过处理的待转化为xml对象的节点 */
export type HtmlXmlParamsNodeItem = HtmlXmlParamsImageNode | HtmlXmlParamsParagrapNode | HtmlXmlParamsTableNode;

/** 传递给htmlJs对象抓换为xml参数过程，用来处理图片的rId和存储问题
 * @example
 * ```
 * // 允许的最大图片cx/cy值：
 * const maxImgC= 123455
 * const getImageStepTwoParamsFnExample = async (imgStepOneParams) => {
  const { cx, cy, step, src } = imgStepOneParams;
  if (!src) return;
  let stepTwoParams = {};
  if (cx && cy) {
    stepTwoParams = { cx, cy };
    if (maxImgC) {
      stepTwoParams = ensureImageCxCy(cx, cy, maxImgC);
    }
  }
  if (step === 0) {
    if (isBase64Image) {
      // 生成blob
    } else {
      //
    }
    // 这里处理图片文件、rels等
  }
  return stepTwoParams;
};
  return stepTwoParams;
};
 * ```
 */
export type GetImageStepTwoParamsFn = ((params: HtmlXmlParamsImageNodeStepOne) => HtmlXmlParamsImageNode) | ((params: HtmlXmlParamsImageNodeStepOne) => Promise<HtmlXmlParamsImageNode>);

/** 解析span时传递给下层的特殊格式，如加粗/倾斜等 */
export interface SpanSpecialStyles {
  /** 加粗? */
  bold?: boolean,
  /** 斜体？ */
  italic?: boolean,
  /** 下划线颜色 */
  underlineColor?: string,
  /** 下划线的样式 */
  underline?: string,
  /** 删除线? */
  strike?: boolean,
  /** 下标? */
  sub?: boolean,
  /** 上标? */
  sup?: boolean,
  /** 文本外框? */
  border?: boolean | string,
  borderColor?: string,
}

export interface XmlTextNode {
  type: 'text',
  text?: string,
  attributes?: { [key: string]: string },
  elements?: (XmlNode | XmlTextNode)[],
}

/** 本包中配置的xml-js解析的Xml节点 */
export interface XmlNode {
  type: 'element',
  name: string,
  attributes?: { [key: string]: string },
  elements?: (XmlNode | XmlTextNode)[],
}
