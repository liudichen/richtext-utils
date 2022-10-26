import { getTextElement } from '../text';

/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 23:24:33
 * @LastEditTime: 2022-10-26 22:37:22
 */
`
      <w:pPr>
        <w:spacing w:beforeLines="100" w:before="312" w:afterLines="100" w:after="312" w:line="480" w:lineRule="auto"/>
        <w:ind w:leftChars="100" w:left="210" w:rightChars="100" w:right="210" w:firstLineChars="200" w:firstLine="480"/>
        <w:jc w:val="left"/>
        <w:rPr>
          <w:rFonts w:ascii="黑体" w:eastAsia="黑体" w:hAnsi="黑体" w:hint="eastAsia"/>
          <w:sz w:val="24"/>
        </w:rPr>
      </w:pPr>
`;

export const getParagraphElement = (params) => {
  const {
    line, // 行距/行高，对应 line-height单位是%时是多倍行距，是pt时为固定行距
    lineRuleExact, // 是否时固定行距，如果固定时，style里会有line-height-rule:exactly
    beforeLines, // 段前距
    before,
    afterLines, // 断后距
    after,

    left, // 段落整体左缩进
    leftChars,
    right, // 段落整体右缩进
    rightChars,
    firstLine, // 首行缩进
    firstLineChars,
    hanging, // 悬挂缩进
    hangingChars,

    align, // 对齐方式: left/center/right/justify/distribute，对用style为text-align,word默认是两端对齐justify，此时不需要插入内容
    fontFamily,
    asciiFont, // w:ascii
    hAnsiFont, // w:hAnsi
    eastAsiaFont, // w:eastAsia
    csFont, // w:cs
    fontSize,
    items,
    pStyle, // 预定义样式名，如标题等级
  } = params || {};
  let w_pStyle = null;
  if (pStyle) {
    w_pStyle = {
      type: 'element',
      name: 'w:pStyle',
      attributes: { 'w:val': `${pStyle}` },
      elements: [],
    };
  }
  let w_spacing = null;
  if (line || before || after) {
    w_spacing = {
      type: 'element',
      name: 'w:spacing',
      attributes: { },
      elements: [],
    };
    if (line) w_spacing.attributes['w:line'] = `${line}`;
    if (before) w_spacing.attributes['w:before'] = `${before}`;
    if (beforeLines)w_spacing.attributes['w:beforeLines'] = `${beforeLines}`;
    if (after)w_spacing.attributes['w:after'] = `${after}`;
    if (afterLines) w_spacing.attributes['w:afterLines'] = `${afterLines}`;
    if (lineRuleExact)w_spacing.attributes['w:lineRule'] = 'exact';
  }
  let w_ind = null;
  if (left || right || leftChars || rightChars || firstLine || hanging) {
    w_ind = {
      type: 'element',
      name: 'w:ind',
      attributes: {},
      elements: [],
    };
    if (left) w_ind.attributes['w:left'] = `${left}`;
    if (leftChars) w_ind.attributes['w:leftChars'] = `${leftChars}`;
    if (right) w_ind.attributes['w:right'] = `${right}`;
    if (rightChars) w_ind.attributes['w:rightChars'] = `${rightChars}`;
    if (firstLine) w_ind.attributes['w:firstLine'] = `${firstLine}`;
    if (firstLineChars) w_ind.attributes['w:firstLineChars'] = `${firstLineChars}`;
    if (hanging) w_ind.attributes['w:hanging'] = `${hanging}`;
    if (hangingChars) w_ind.attributes['w:hangingChars'] = `${hangingChars}`;
  }
  let w_jc = null;
  if (align) {
    w_jc = { type: 'element',
      name: 'w:jc',
      attributes: {
        'w:val': align,
      },
      elements: [] };
  }
  let w_rFonts = null;
  if (fontFamily || asciiFont || hAnsiFont || eastAsiaFont || csFont) {
    w_rFonts = {
      type: 'element',
      name: 'w:rFonts',
      attributes: { 'w:hint': 'eastAsia' },
      elements: [],
    };
    if (asciiFont || hAnsiFont || eastAsiaFont || csFont) {
      if (asciiFont) w_rFonts.attributes['w:ascii'] = asciiFont;
      if (hAnsiFont) w_rFonts.attributes['w:hAnsi'] = hAnsiFont;
      if (eastAsiaFont) w_rFonts.attributes['w:eastAsia'] = eastAsiaFont;
      if (csFont) w_rFonts.attributes['w:cs'] = csFont;
    } else {
      w_rFonts.attributes = { 'w:hAnsi': fontFamily, 'w:ascii': fontFamily, 'w:eastAsia': fontFamily, 'w:hint': 'eastAsia' };
    }
  }
  let w_sz = null;
  let w_szCs = null;
  if (fontSize) {
    w_sz = {
      type: 'element',
      name: 'w:sz',
      attributes: {
        'w:val': `${fontSize}`,
      },
      elements: [],
    };
    w_szCs = {
      type: 'element',
      name: 'w:szCs',
      attributes: {
        'w:val': `${fontSize}`,
      },
      elements: [],
    };
  }
  let w_rPr = null;
  if (w_rFonts || w_sz) {
    w_rPr = {
      type: 'element',
      name: 'w:rPr',
      elements: [],
    };
    if (w_rFonts) w_rPr.elements.push(w_rFonts);
    if (w_sz) {
      w_rPr.elements.push(w_sz);
      w_rPr.elements.push(w_szCs);
    }
  }
  let w_pPr = null;
  if (w_pStyle || w_spacing || w_ind || w_jc || w_rPr) {
    w_pPr = {
      type: 'element',
      name: 'w:pPr',
      elements: [],
    };
    if (w_pStyle) w_pPr.elements.push(w_pStyle);
    if (w_spacing) w_pPr.elements.push(w_spacing);
    if (w_ind) w_pPr.elements.push(w_ind);
    if (w_jc) w_pPr.elements.push(w_jc);
    if (w_rPr) w_pPr.elements.push(w_rPr);
  }
  const w_p = {
    type: 'element',
    name: 'w:p',
    attributes: {
      'w:rsidR': '00411124',
      'w:rsidRDefault': '00411124',
    },
    elements: [ ],
  };
  if (w_pPr) {
    w_p.elements.push(w_pPr);
  }
  for (let i = 0; i < items?.length; i++) {
    const node = items[i];
    const { type } = node || {};
    if (type === 'text') {
      const textEle = getTextElement(node);
      w_p.elements.push(textEle);
    } else if (type === 'table') {
      //
    } else if (type === 'image') {
      //
    }
  }
  return w_pPr;
};
