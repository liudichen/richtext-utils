/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 12:09:03
 * @LastEditTime: 2022-11-07 09:56:37
 */
type inlineStyleObjectConvertFn= (styleObject: object) => object;

/** 节点对象结构配置
 * (主要是对应的type名称和各个属性的key值)
 * ,以及传入默认的字体属性
 * */
export interface INodeStructAndConvertConfig {
  /** 除文本和注释外其他节点的type值
   * ```
   * 最终节点对应的属性样式：
   * { type: [NODETAG] }
   * ```
   * @defaultValue 'element'
   */
  NODETAG?: string,
  /** 除文本和注释外其他节点的标签名对应的key
   * ```
   * 最终节点对应的属性样式
   * { [NODENAME]: 'img' }
   * ```
   * @defaultValue 'name'
   */
  NODENAME?: string,
  /** 文本节点的type值
   * ```
   * 最终节点对应的属性样式：
   * { type: [TEXTTAG] }
   * ```
   * @defaultValue 'text'
   */
  TEXTTAG?: string,
  /** 文本节点的文本内容对应的key
   * ```
   * 最终节点对应的属性样式：
   * { [TEXTVALUE]: '这是文本内容' }
   * ```
   * @defaultValue 'text'
   */
  TEXTVALUE?: string,
  /** 注释节点对应的type值
   * ```
   * 最终节点对应的属性样式：
   * { type: [COMMENTTAG] }
   * ```
   * @defaultValue 'comment'
   */
  COMMENTTAG?: string,
  /** 注释节点的内容对应的key
   * ```
   * 最终节点对应的属性样式：
   * { [COMMENTVALUE]: '这是注释内容' }
   * ```
   * @defaultValue 'comment'
   */
  COMMENTVALUE?: string,
  /** 子节点数组项对应的key
   * ```
   * 最终节点对应的属性样式：
   * { [CHILDREN]: [ subNode1, subNode2, ... ] }
   * ```
   * @defaultValue 'elements'
   */
  CHILDREN?: string,
  /** 内联样式的对象形式项点对应的key
   * ```
   * 最终节点对应的属性样式：
   * { [STYLE]: { color:'red' } }
   * ```
   * @defaultValue 'style'
   */
  STYLE?: string,
  /** 节点样式class类数组对应的key
   * ```
   * 最终节点对应的属性样式：
   * { [CLASSLIST]: [ 'class1', 'xxtewt' ] }
   * ```
   * @defaultValue 'classList'
   */
  CLASSLIST?: string,
  /** 节点属性项对应的key
   * ```
   * 最终节点对应的属性样式：
   * { [ATTRIBUTES]: { width: '500px', height: 200 } }
   * ```
   * @defaultValue 'attributes'
   */
  ATTRIBUTES?: string,
  /** 内联样式原文本项对应的key
   * ```
   * 最终节点对应的属性样式：
   * { [INLINESTYLE]: 'color:red;font-size:12pt' }
   * ```
   * @defaultValue 'inlineStyle'
   */
  INLINESTYLE?: string,

  /** 普通段落的默认字体大小(是word的xml里的尺寸，是pt值的2倍) */
  defaultFontSize?: number,
  /** 普通段落的默认字体 */
  defaultFontFamily?: string,
  /** 表格中文字的默认字体 */
  defaultTableFontFamily?: string,
  /** 表格中文本的默认字体大小(是word的xml里的尺寸，是pt值的2倍) */
  defaultTableFontSize?: number,
  /** 图片的最大cx */
  maxImgCx?: number,
  /** 图片的最大cy */
  maxImgCy?: number,
  /** 表格的最大宽度 */
  tableMaxWidth?: number,
  /** 根据自动列表等级生产额外的style base0 */
  listExtraStyleGenerateFn?: (lvl: number, index?: number) => object,
}


export interface IInlineStyleToObjectOptions {
  /**
   * 内联样式的属性名称改为驼峰命名?
   * @defaultValue true
   */
  styleCamelCase?: boolean,
  /**
   * 内联样式对象转换，会在内联样式对象处理后再对其进行转化
   */
  inlineStyleObjectConvert?: inlineStyleObjectConvertFn,
}

interface ITextJsonItem {
  type: string,
  text: string,
}

interface ICommentJsonItem {
  type:string,
  comment: string,
}

interface ICustomJsonItem {
  type: string,
  [key: string]: unknown
}

interface INodeJsonItem {
  type: string,
  name: string,
  classList?: string[],
  attributes?: object,
  inlineStyle?: string,
  style?: object,
  elements: (ITextJsonItem | ICommentJsonItem | INodeJsonItem)[]
}


export type IJsonNodeItem = ITextJsonItem | ICommentJsonItem | INodeJsonItem | ICustomJsonItem;

export interface IHtmlToJsonOptions extends IInlineStyleToObjectOptions {
  /**
   * 跳过style标签的解析?
   * @defaultValue false
   */
  skipStyle?: boolean,
  /**
   * 保留内联样式?
   * @defaultValue true
   * 如果为true会在结果中将内联样式转化为一个对象
   */
  keepInlineStyle?: boolean,
  /**
   * 在结果中保留原始内联样式文本?
   * @defaultValue false
   */
  keepRawInlineStyle?: boolean,
  /**
   * 跳过script标签内容的解析?
   * @defaultValue false
   */
  skipScript?: boolean,
  /**
   * 在结果中保留class?如果保留将将class拆分为数组
   * @defaultValue true
   */
  keepClass?: boolean,
  /**
   * 在结果中保留注释?
   * @defaultValue false
   */
  skipComment?: boolean,
  /** 过滤tag的属性名 */
  attributeNameFilter?: (attributeName: string) => boolean,
}
