/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 09:35:05
 * @LastEditTime: 2022-10-28 09:40:02
 */
import { isAllChineseWord } from '../../judgeAndCompare';

export const getFontFamlyFromHtmlStyleObj = (styles, onlyHans = true) => {
  if (!styles || typeof styles !== 'object') return;
  const keys = Object.keys(styles).filter((ele) => ele.includes('font-family'));
  if (!keys.length) return;
  const values = keys.map((ele) => styles[ele]);
  if (keys.includes('font-family')) return styles['font-family'];
  const hans = values.find((ele) => isAllChineseWord(ele));
  if (onlyHans) return hans;
  return hans || values[0];
};

export const htmlFontSizeToWordFontSizeNumber = (fontSize) => {
  let type = '';
  let number = 0;
  if (typeof fontSize === 'number') {
    type = 'px'; number = fontSize;
  } else if (typeof fontSize === 'string' && /^[\d.]+(pt|px)$/.test(fontSize)) {
    number = +fontSize.slice(0, fontSize.length - 2);
    if (!isNaN) {
      type = fontSize.slice(-2);
    }
  }
  if (type === 'px') number = number * 3 / 4;
  if (type) number = number * 2;
  return Math.round(number || 0);
};
