/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:28:17
 * @LastEditTime: 2022-10-27 23:10:32
 */
import { DefaultNodeStructOptions } from '../../../dataParse';
import { getTextParams } from '../../style';
import { imageParser } from '../image';

export const parseSpan = (node, specailStyles = {}, parentStyles = {}, result = [], nodeStructOptions) => {
  const { NODENAME, TEXTTAG, TEXTVALUE, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [NODENAME]: tagName, type, [STYLE]: style, [TEXTVALUE]: text, [CHILDREN]: children } = node;
  if (type === TEXTTAG) {
    const textParams = getTextParams({ ...parentStyles, ...specailStyles });
    result.push({ type: 'text', text, ...textParams });
  } else if ([ 'b', 'strong', 'em', 'i', 'u', 's', 'sub', 'sup' ].includes(tagName)) {
    const newSpecialStyles = { ...specailStyles };
    if (tagName === 'b' || tagName === 'strong') {
      newSpecialStyles.bold = true;
    } else if (tagName === 'em' || tagName === 'i') {
      newSpecialStyles.italic = true;
    } else if (tagName === 'u') {
      newSpecialStyles.underline = true;
    } else if (tagName === 's') {
      newSpecialStyles.strike = true;
    } else if (tagName === 'sub') {
      newSpecialStyles.sub = true;
    } else if (tagName === 'sup') {
      newSpecialStyles.sup = true;
    }
    children.forEach((ele) => parseSpan(ele, newSpecialStyles, { ...parentStyles }, result, nodeStructOptions));
  } else if (tagName === 'span') {
    children.forEach((ele) => parseSpan(ele, { ...specailStyles }, { ...style }, result, nodeStructOptions));
  } else if (tagName === 'img') {
    result.push(imageParser(node, nodeStructOptions));
  }
};
