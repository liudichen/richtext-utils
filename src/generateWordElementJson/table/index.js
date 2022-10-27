/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 16:25:39
 * @LastEditTime: 2022-10-27 17:35:43
 */
//  <w:tcBorders>
//               <w:top w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:left w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>
//             </w:tcBorders>
const getCellBordersXmlObj = (borders) => {
  if (!borders || typeof borders !== 'object' || !Object.keys(borders).length) return;
  const w_tcBorders = { type: 'element', name: 'w:tcBorders', elements: [] };
  // if(xxxx)
  return w_tcBorders;
};

// 待处理，行高等属性，合并单元格的验证
const getTableCellXmlObj = (params) => {
  const {
    colspan, // 水平单元格合格
    rowspan, // 垂直合并单元格
    width,
    borders,
    vAlign, // 单元格的垂直对齐方式， word里默认是top，html里默认是center,对应th，tc属性的vertical-align:bottom/top，center时style里没有。水平对齐由下面的段落控制。
  } = params || {};
  const w_tcPr = { type: 'element', name: 'w:tcPr', elements: [] };
  if (+width) w_tcPr.elements.push({ type: 'element', name: 'w:tcW', attributes: { 'w:w': `${width}`, 'w:type': 'dxa' } });
  if (+rowspan) w_tcPr.elements.push({ type: 'element', name: 'w:vMerge', elements: [] });
  if (+colspan) w_tcPr.elements.push({ type: 'element', name: 'w:gridSpan', attributes: { 'w:val': `${colspan}` } });
  const w_tcBorders = getCellBordersXmlObj(borders);
  if (w_tcBorders) w_tcPr.elements.push(w_tcBorders);
  if (vAlign === 'center' || vAlign === 'bottom') w_tcPr.elements.push({ type: 'element', name: 'w:vAlign', attributes: { 'w:val': vAlign } });
};

const getTableRowXmlObj = (params) => {
  const {
    cantSplit, // 是否将允许跨页断行关掉(word默认是允许跨页断行的), <tr>的style里有page-break-inside:avoid时为true
    isHeader, // 是否是标题行, 标题行的上层是<thead>下层为<th>
    height,
    cells,
  } = params || {};
  let w_trPr = null;
  if (cantSplit || isHeader || height) {
    w_trPr = { type: 'element', name: 'w:trPr', elements: [] };
    if (cantSplit) w_trPr.elements.push({ type: 'element', name: 'w:cantSplit', elements: [] });
    if (isHeader) w_trPr.elements.push({ type: 'element', name: 'w:tblHeader', elements: [] });
    if (+height) w_trPr.elements.push({ type: 'element', name: 'w:trHeight', attributes: { 'w:val': `${+height}` } });
  }
  const w_tr = { type: 'element', name: 'w:tr', elements: [] };
  if (w_trPr) w_tr.elements.push(w_trPr);
};
