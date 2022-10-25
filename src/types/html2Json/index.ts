/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 12:09:03
 * @LastEditTime: 2022-10-25 12:11:52
 */
type inlineStyleObjectConvertFn= (styleObject: object) => object;
export interface inlineStyleToObjectOptions {
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

export interface htmlToJsonOptions extends inlineStyleToObjectOptions {
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
