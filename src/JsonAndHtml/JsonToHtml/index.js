/* eslint-disable no-case-declarations */
/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 17:05:08
 * @LastEditTime: 2022-10-27 10:32:31
 */
import { selfCloseTagRegexp, DefaultNodeStructOptions } from '../constant';

const isPlainObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
const setAttrs = (attrs, results) => {
  Object.keys(attrs || {}).forEach((k) => {
    if (!attrs[k]) {
      results.push(k);
    } else {
      results.push(' ', k, '=', '"', attrs[k], '"');
    }
  });
};

export const separatorCase = (key, separator = '_') => {
  let str = key || '';
  if (str.length && str.slice(0, 1) === str.slice(0, 1).toUpperCase()) {
    str = str.slice(0, 1).toLowerCase() + str.slice(1);
  }
  return str.replace(/([A-Z])/g, `${separator}$1`);
};

const toElement = (elementInfo, results, config) => {
  const { NODENAME, NODETAG, TEXTTAG, TEXTVALUE, COMMENTTAG, COMMENTVALUE, CHILDREN, STYLE, CLASSLIST, ATTRIBUTES, INLINESTYLE } = Object.assign({ ...DefaultNodeStructOptions }, config);
  switch (elementInfo.type) {
    case NODETAG:
      const tagName = elementInfo[NODENAME];
      results.push('<', tagName);
      let inlineStyle = elementInfo[INLINESTYLE];
      if (!inlineStyle && elementInfo[STYLE]) {
        const styleKeys = Object.keys(elementInfo[STYLE]);
        inlineStyle = '';
        for (let i = 0; i < styleKeys.length; i++) {
          const k = styleKeys[i];
          inlineStyle += `${k}:${elementInfo[STYLE][k]};`;
        }
      }
      if (inlineStyle) {
        results.push(' style="', inlineStyle, '"');
      }
      if (elementInfo[CLASSLIST]?.length) {
        results.push(' class="', elementInfo[CLASSLIST].join(' '), '"');
      }
      setAttrs(elementInfo[ATTRIBUTES], results);
      if (selfCloseTagRegexp.test(tagName)) {
        results.push(' />');
      } else {
        results.push('>');
        if (Array.isArray(elementInfo[CHILDREN])) {
          elementInfo[CHILDREN].forEach((item) => toElement(item, results, config));
        }
        results.push('</', tagName, '>');
      }
      break;
    case TEXTTAG:
      results.push(elementInfo[TEXTVALUE]);
      break;
    case COMMENTTAG:
      results.push('<!-- ', elementInfo[COMMENTVALUE], ' -->');
      break;
    default:
        // ignore
  }
};
export const jsonToHtml = (json, config) => {
  json = json || [];
  if (isPlainObject(json)) {
    json = [ json ];
  }
  const results = [];
  json.forEach((item) => toElement(item, results, config));
  return results.join('');
};
