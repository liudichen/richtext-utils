/* eslint-disable no-case-declarations */
/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 17:05:08
 * @LastEditTime: 2022-10-26 08:47:46
 */
import {
  TAG, TEXT, COMMENT,
  selfCloseTagRegexp,
} from '../constant';

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

export const separatorCase = (key,separator='_') => {
  let str = key ||'';
  if(str.length && str.slice(0,1)===str.slice(0,1).toUpperCase()){
    str = str.slice(0,1).toLowerCase()+str.slice(1)
  }
  return str.replace(/([A-Z])/g, `${separator}$1`)
};

const toElement = (elementInfo, results) => {
  switch (elementInfo.type) {
    case TAG:
      const tagName = elementInfo.tagName;
      results.push('<', tagName);
      let inlineStyle = elementInfo.inlineStyle;
      if (!inlineStyle && elementInfo.style) {
        const styleKeys = Object.keys(elementInfo.style);
        inlineStyle = '';
        for (let i = 0; i < styleKeys.length; i++) {
          const k = styleKeys[i];
          inlineStyle += `${k}:${elementInfo.style[k]};`;
        }
      }
      if (inlineStyle) {
        results.push(' style="', inlineStyle, '"');
      }
      if (elementInfo.classList?.length) {
        results.push(' class="', elementInfo.classList.join(' '), '"');
      }
      setAttrs(elementInfo.attrs, results);
      if (selfCloseTagRegexp.test(tagName)) {
        results.push(' />');
      } else {
        results.push('>');
        if (Array.isArray(elementInfo.children)) {
          elementInfo.children.forEach((item) => toElement(item, results));
        }
        results.push('</', tagName, '>');
      }
      break;
    case TEXT:
      results.push(elementInfo.value);
      break;
    case COMMENT:
      results.push('<!-- ', elementInfo.value, ' -->');
      break;
    default:
        // ignore
  }
};
export const jsonToHtml = (json) => {
  json = json || [];
  if (isPlainObject(json)) {
    json = [ json ];
  }
  const results = [];
  json.forEach((item) => toElement(item, results));
  return results.join('');
};
