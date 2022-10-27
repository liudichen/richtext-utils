/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 20:07:33
 * @LastEditTime: 2022-10-27 21:24:37
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
