/* eslint-disable jsdoc/require-param */

/** html style的段落间距相关的尺寸大小转 word xml属性的数值大小
 * mso-para-margin-top： w:beforeLines
 * mso-para-margin-bottom： w:afterLines
 * mso-para-margin-right： gd-> w:ind-w:rightChars cm/pt -> w:ind-w:right
 * mso-para-margin-left: gd-> w:ind-w:leftChars cm/pt -> w:ind-w:left
 * line-height： /w:line
 * text-indent负数时：w:ind-w:hanging,
 * text-indent:正数  w:ind-w:firstLine
 * mso-char-indent-count: w:ind-w:firstLineChars
 * **/
export const htmlSpacingSizeToWordSizeNumber = (size) => {
  if (!size) return;
  if (typeof size === 'number' || (typeof size === 'string' && /^[\d]+$/.test(size))) size = `${size}px`;
  if (typeof size !== 'string') return;
  if (size.endsWith('px')) {
    size = +(size.slice(0, size.length - 2).trim());
    if (!size) return;
    size = `${size * 3 / 4}pt`;
  }
  if (!/^-?[\d.]+(cm|gd|pt|%)$/.test(size)) return;
  if (size.endsWith('%')) {
    const number = +size.slice(0, size.length - 1);
    if (isNaN(number)) return;
    return Math.round(number * 240 / 100);
  }
  const number = +size.slice(0, size.length - 2);
  if (isNaN(number)) return;
  if (size.endsWith('cm')) {
    return Math.round(number * 567);
  }
  if (size.endsWith('pt')) {
    if (number < 1) return;
    return Math.round(number * 20);
  }
  // gd
  return Math.round(number * 100);
};

// 上 右 下 左
export const splitHtmlMarginString = (margin) => {
  if (!margin || typeof margin !== 'string') return [];
  margin = margin.split(/[\s]+/);
  if (margin.length === 0) return [];
  if (margin.length >= 4) return margin.slice(0, 4);
  if (margin.length === 2) return [ margin[0], margin[1], [ margin[0], margin[1] ]];
  if (margin.length === 1) return [ margin[0], margin[0], margin[0], margin[0] ];
  return [ ...margin, margin[1] ];
};

