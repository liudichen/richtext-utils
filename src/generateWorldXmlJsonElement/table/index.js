/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 16:25:39
 * @LastEditTime: 2022-11-08 21:34:17
 */

import { getTableRowXmlObj } from './row';


// 待处理，行高等属性，合并单元格的验证

`
    <w:tblPr>
        <w:tblStyle w:val="a3"/>
        <w:tblW w:w="0" w:type="auto"/>
        <w:jc w:val="center"/>
        <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="1382"/>
        <w:gridCol w:w="1382"/>
        <w:gridCol w:w="1383"/>
        <w:gridCol w:w="1383"/>
        <w:gridCol w:w="1383"/>
      </w:tblGrid>
`;

// tblGrid可以不传，或不用传w:w，只要每个单元格有宽度就没问题
// w:tcW 如果不传w:w，则会自适应
`<w:tcPr>
            <w:tcW w:w="573" w:type="dxa"/>
            <w:tcBorders>
              <w:top w:val="single" w:sz="12" w:space="0" w:color="auto"/>
              <w:left w:val="single" w:sz="12" w:space="0" w:color="auto"/>
              <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto"/>
              <w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>
            </w:tcBorders>
            <w:vAlign w:val="center"/>
          </w:tcPr>`;


export const getTableXmlElementObj = (params) => {
  const {
    rows,
    colWidths,
    cols,
    width,
    // height,
    ind,
    layout,
    align = 'center',
    // borders,
  } = params || {};
  const w_tblGrid = {
    type: 'element', name: 'w:tblGrid',
    elements: [
      { type: 'element', name: 'w:tblStyles', attributes: { 'w:val': 'a6' }, elements: [] },
    ],
  };
  for (let i = 0; i < cols; i++) {
    const w_gridCol = {
      type: 'element', name: 'w:gridCol',
      elements: [],
    };
    if (colWidths && colWidths?.length === cols) {
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
    w_tbl.elements.push(getTableRowXmlObj(rows[i]));
  }
  return [
    w_tbl,
    { type: 'element', name: 'w:p', elements: [] },
  ];
};
