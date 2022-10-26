/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 23:24:33
 * @LastEditTime: 2022-10-25 23:57:08
 */
export const getParagraphElement = (params) => {
  const {
    align, // 对齐方式: left/center/right/justify
    fontFamily,
    fontSize,
    lineHeight = 1.5, // 行距/行高
    lineExact,
  } = params || {};
  const w_line = (lineExact ? 20 * lineHeight : 240 * lineHeight);
  const w_spacing = {
    type: 'element',
    name: 'w:spacing',
    attributes: {
      'w:line': `${w_line}`,
    },
    elements: [],
  };
  if (lineExact) {
    w_spacing.attributes['w:lineRule'] = 'exact';
  }
  const w_pPr = {
    type: 'element',
    name: 'w:pPr',
    elements: [
      {
        type: 'element',
        name: 'w:adjustRightInd',
        attributes: {
          'w:val': '0',
        },
        elements: [],
      },
      {
        type: 'element',
        name: 'w:snapToGrid',
        attributes: {
          'w:val': '0',
        },
        elements: [],
      },
    ],
  };
  if ([ 'left', 'center', 'right' ].includes(align)) {
    const w_jc = {
      type: 'element',
      name: 'w:jc',
      attributes: {
        'w:val': align,
      },
      elements: [],
    };
    w_pPr.elements.push(w_jc);
  }
};
