/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 16:17:05
 * @LastEditTime: 2022-10-24 17:36:12
 */
type inlineStyleObjectConvertFn= (styleObject: object) => object;

interface inlineStyleToObjectOptions {
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

interface htmlToJsonOptions extends inlineStyleToObjectOptions {
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
}

interface textJsonItem {
  type: 'text',
  value: string,
}

interface commentJsonItem {
  type:'comment',
  value: string,
}

interface otherJsonItem {
  type: 'tag',
  tagName: string,
  classList?: string[],
  attrs?: object,
  inlineStyle?: string,
  style?: object,
  children: (otherJsonItem | textJsonItem | commentJsonItem)[]
}

export type jsonItem = textJsonItem | commentJsonItem | otherJsonItem;

/** 将属性名称由-间隔模式转化为小驼峰式 */
export const camelCase: (key: string) => string;

/** 将属性名称由-间隔模式转化为大驼峰式 */
export const pascalCase: (key: string) => string;

/** 将内联样式文本转化为对象 */
export const inlineStyleToObject: (style: string, options?: inlineStyleToObjectOptions) => object;

/** 将html字符串转化为对象 */
export const htmlToJson: (html: string, options?: htmlToJsonOptions) => jsonItem[];
