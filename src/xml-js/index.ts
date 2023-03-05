/** xml-js 相关默认配置 */

export const xml2JsOptions = {
  ignoreComment: true,
  alwaysChildren: true,
  compact: false,
  trim: true,
};

export const js2XmlOptions = {
  compact: false,
  ignoreComment: true,
  space: 2,
  fullTagEmptyElement: false,
};

export * from './wordMeta';
