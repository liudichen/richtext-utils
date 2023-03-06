import type { HtmlXmlParamsTableNode, XmlElementGenerationConfig, XmlNode } from '@/types/index';

import { tableRowXmlParamsNodeToXmlElementObj } from './tableRowNode';

/** 解析并转换后的表格的xml参数节点转换为xml的js对象 */
export const tableXmlParamsNodeToXmlElementObj = (tableNode: HtmlXmlParamsTableNode, config: XmlElementGenerationConfig = {}) => {
  const {
    rows,
    colWidths,
    cols,
    width,
    // height,
    ind,
    layout,
    align = 'center',
    borders,
  } = tableNode;

  /** 暂时还没用 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tableMaxWidth } = config || {};
  const w_tblGrid: XmlNode = {
    type: 'element', name: 'w:tblGrid',
    elements: [ ],
  };
  for (let i = 0; i < cols; i++) {
    const w_gridCol: XmlNode = {
      type: 'element', name: 'w:gridCol',
      elements: [],
    };
    if (colWidths?.[i]) {
      w_gridCol.attributes = { 'w:w': `${colWidths[i]}` };
    }
    w_tblGrid.elements.push(w_gridCol);
  }
  const w_tblPr = {
    type: 'element', name: 'w:tblPr',
    elements: [ ],
  };
  w_tblPr.elements.push({
    type: 'element', name: 'w:tblW', elements: [],
    attributes: width ? { 'w:w': `${width}`, 'w:type': 'dxa' } : { 'w:w': '0', 'w:type': 'auto' },
  });
  if (align) {
    w_tblPr.elements.push({
      type: 'element', name: 'w:jc', elements: [],
      attributes: { 'w:val': align },
    });
  }
  if (borders) {
    const keys = Object.keys(borders);
    if (keys.length) {
      const w_tblBorders = {
        type: 'element', name: 'w:tblBorders',
        elements: [],
      };
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const { val, sz, space, color } = borders[k];
        const borderInfo = {
          type: 'element', name: `w:${k}`, attributes: {},
        };
        if (val) borderInfo.attributes['w:val'] = val;
        if (typeof sz !== 'undefined') borderInfo.attributes['w:sz'] = `${sz}`;
        borderInfo.attributes['w:space'] = `${space || 0}`;
        if (color) borderInfo.attributes['w:color'] = `${color}`;
        w_tblBorders.elements.push(borderInfo);
      }
      w_tblPr.elements.push(w_tblBorders);
    }
  }
  if (ind) {
    w_tblPr.elements.push({
      type: 'element', name: 'w:tblInd', elements: [],
      attributes: { 'w:w': `${ind}`, 'w:type': 'dxa' },
    });
  }
  if (layout) {
    w_tblPr.elements.push({
      type: 'element', name: 'w:tblLayout', elements: [],
      attributes: { 'w:type': layout },
    });
  }
  const w_tbl = {
    type: 'element', name: 'w:tbl',
    elements: [ w_tblPr, w_tblGrid ],
  };
  for (let i = 0; i < rows.length; i++) {
    w_tbl.elements.push(tableRowXmlParamsNodeToXmlElementObj(rows[i], config));
  }
  return [
    w_tbl,
    { type: 'element', name: 'w:p', elements: [] },
  ] as XmlNode[];
};


// 待处理，行高等属性，合并单元格的验证

// `
//     <w:tblPr>
//         <w:tblStyle w:val="a3"/>
//         <w:tblW w:w="0" w:type="auto"/>
//         <w:jc w:val="center"/>
//         <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
//       </w:tblPr>
//       <w:tblGrid>
//         <w:gridCol w:w="1382"/>
//         <w:gridCol w:w="1382"/>
//         <w:gridCol w:w="1383"/>
//         <w:gridCol w:w="1383"/>
//         <w:gridCol w:w="1383"/>
//       </w:tblGrid>
// `;

// // tblGrid可以不传，或不用传w:w，只要每个单元格有宽度就没问题
// // w:tcW 如果不传w:w，则会自适应
// `<w:tcPr>
//             <w:tcW w:w="573" w:type="dxa"/>
//             <w:tcBorders>
//               <w:top w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:left w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>
//             </w:tcBorders>
//             <w:vAlign w:val="center"/>
//           </w:tcPr>`;
