/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:55:51
 * @LastEditTime: 2022-10-27 23:29:00
 */
import { DefaultNodeStructOptions } from '../../../dataParse/constant';
import { getParagraphParams } from '../../style';
import { parseSpan } from '../span';
import { imageParser } from '../image';

export const paragraphParser = (node, nodeStructOptions) => {
  const { NODENAME, TEXTTAG, TEXTVALUE, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [CHILDREN]: children, [STYLE]: style } = node;
  const data = [];
  let imgFirst = true;
  const paragraphParams = getParagraphParams(style);
  let items = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const { [NODENAME]: tagName, type, [TEXTVALUE]: text } = child;
    if (type === TEXTTAG) {
      items.push({ type, text });
      if (!data.length) imgFirst = false;
    }
    if (tagName === 'span') {
      const result = [];
      parseSpan(child, {}, {}, result, nodeStructOptions);
      items.push(...result);
      if (!data.length) imgFirst = false;
    } else if (tagName === 'img') { // 内联图片可以任务是p的子元素
      items.push(imageParser(child, nodeStructOptions));
    } else if (tagName === 'figure') { // 块图片，直接拿到外面
      const source = child[CHILDREN].filter((ele) => ele[tagName] === 'img');
      source.forEach((ele) => {
        const imgNode = imageParser(ele, nodeStructOptions);
        data.push(imgNode);
      });
    }
  }
  // 清除没有文本内容的 text子项
  items = items.filter((ele) => ele.type !== TEXTTAG || ele[TEXTVALUE] !== '');
  if (imgFirst || !data.length) {
    data.push({ ...paragraphParams, items });
  } else {
    data.unshift({ ...paragraphParams, items });
  }
  return data;
};
