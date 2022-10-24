/* eslint-disable no-case-declarations */
/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 17:05:08
 * @LastEditTime: 2022-10-24 17:52:25
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

export const underlineCase = (key) => {
  return (key || '').replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
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
          inlineStyle += `${underlineCase(k)}:${elementInfo.style};`;
        }
      }
      if (inlineStyle) {
        results.push(' style="', elementInfo.inlineStyle, '"');
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
