/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 22:16:32
 * @LastEditTime: 2022-10-27 12:32:21
 */
export interface IWordXmlElement {
  type: 'element' | 'text',
  name: string,
  attributes?: object,
  elements: IWordXmlElement[]
}

export interface IGetTextXmlElementParams {
  type: 'text',
  /** 字体
   * @defaultValue 宋体
   */
  fontFamily?: string,
  /** 字号
   * @defaultValue 24
   */
  fontSize?: number | string,
  /** 文本 */
  text: string,
  /** 是否加粗 */
  bold?: boolean,
  /** 字体颜色 */
  color?: string,
  /** 是否斜体 */
  italic?: boolean,
  /** 下划线类型 */
  underline?: string,
  /** 是否有文字删除线 */
  strike?: boolean,
  /** 文字高亮的背景颜色 */
  backgroundColor?: string,
  /** 下标? */
  sub?: boolean,
  /** 上标? */
  sup?: boolean,
  // /** 是否有文字底纹 */
  // shd?: boolean,
  /** 字符间距单位是pt */
  kern?: string | number,
}

export interface IGetImageXmlElementParams {
  type: 'image',
  width?: number | string,
  height?: number | string,
}

export interface IGetTableXmlElementParams {
  type: 'table',
}

export interface IGetParagraphXmlElementParams {
  type: 'p',
  /** 行距/行高 */
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
  /** 字体 */
  fontFamily?: string,
  asciiFont?: string, // w:ascii
  hAnsiFont?: string, // w:hAnsi
  eastAsiaFont?: string, // w:eastAsia
  csFont?: string, // w:cs
  fontSize?: number,
  items?: (IGetTextXmlElementParams | IGetImageXmlElementParams | IGetTableXmlElementParams)[],
  /** 段落预定义样式，如标题等级 */
  pStyle?: string, // 预定义样式名，如标题等级
}
