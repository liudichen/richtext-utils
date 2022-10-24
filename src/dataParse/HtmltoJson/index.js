/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 14:52:20
 * @LastEditTime: 2022-10-24 17:52:43
 */
import { Parser } from 'htmlparser2';
import { TAG, COMMENT, TEXT,
  scriptRegexp, styleRegexp, zeroValueRegexp, numberValueRegexp,
} from '../constant';

const capitalize = (word) => {
  return (word || '').replace(/( |^)[a-z]/, (c) => c.toUpperCase());
};
export const pascalCase = (key) => {
  return (key || '').split(/[_-]/).map(capitalize).join('');
};
export const camelCase = (key) => {
  return (key || '').replace(/[_-](\w)/g, (all, letter) => letter.toUpperCase());
  // return (key || '').split(/[_-]/).map((item, i) => (i === 0 ? item : capitalize(item))).join('');
};

export const inlineStyleToObject = (style, options) => {
  options = Object.assign({ styleCamelCase: true }, options);
  if (!style || typeof style !== 'string') {
    return {};
  }
  const styleObject = {};
  const styles = style.split(';');
  styles.forEach((item) => {
    let [ prop, value ] = item.split(':');
    prop = prop?.trim();
    value = value?.trim();
    if (prop && value) {
      value = numberValueRegexp.test(value) ? Number(value) : zeroValueRegexp.test(value) ? 0 : value;
      styleObject[options.styleCamelCase ? camelCase(prop) : prop] = value;
    }
  });
  if (typeof options?.inlineStyleObjectConvert === 'function') {
    return options.inlineStyleObjectConvert(styleObject);
  }
  return styleObject;
};

export const htmlToJson = (html, options) => {
  options = Object.assign({ skipStyle: false, keepInlineStyle: true, keepRawInlineStyle: false, skipScript: false, keepClass: true, keepAttributes: true, skipComment: false, styleCamelCase: true }, options);
  const json = [];
  let levelNodes = [];
  const parser = new Parser({
    onopentag(name, { style, class: classNames, ...attrs }) {
      let node = {};
      if ((scriptRegexp.test(name) && options.skipScript) || (styleRegexp.test(name) && options.skipStyle)) {
        node = false;
      } else {
        node = {
          type: TAG,
          tagName: name,
          children: [],
        };
        if (options.keepClass) {
          node.classList = (classNames || '').split(/\s+/).filter(Boolean);
        }
        if (options.keepAttributes) {
          node.attrs = { ...attrs };
        }
        if (options.keepInlineStyle && style) {
          const styleText = style.replace(/&quot;/g, '');
          if (options.keepRawInlineStyle) {
            node.inlineStyle = styleText;
          }
          node.style = inlineStyleToObject(styleText, { styleCamelCase: options.styleCamelCase, inlineStyleObjectConvert: options.inlineStyleObjectConvert });
        }
      }
      if (levelNodes[0]) {
        if (node !== false) {
          const parent = levelNodes[0];
          parent.children.push(node);
        }
        levelNodes.unshift(node);
      } else {
        if (node !== false) {
          json.push(node);
        }
        levelNodes.push(node);
      }
    },
    ontext(text) {
      const parent = levelNodes[0];
      if (parent === false) {
        return;
      }
      const node = { type: TEXT, value: text };
      if (!parent) {
        json.push(node);
      } else {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    oncomment(comments) {
      if (options.skipComment) {
        return;
      }
      const parent = levelNodes[0];
      if (parent === false) {
        return;
      }
      const node = {
        type: COMMENT,
        value: comments,
      };
      if (!parent) {
        json.push(node);
      } else {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    onclosetag() {
      levelNodes.shift();
    },
    onend() {
      levelNodes = null;
    },
  });
  parser.end(html);
  return json;
};
