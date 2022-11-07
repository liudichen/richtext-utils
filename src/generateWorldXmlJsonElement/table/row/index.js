/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:02:01
 * @LastEditTime: 2022-11-07 20:23:19
 */

import { getTableCellXmlObj } from '../cell';

`
虽然xml里可以有行w:jc(https://learn.microsoft.com/zh-cn/dotnet/api/documentformat.openxml.wordprocessing.tablerowproperties?view=openxml-2.8.1),但粘贴的html里没有行的水平对齐方式的属性
`;
export const getTableRowXmlObj = (params) => {
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
  for (let i = 0; i < cells?.length; i++) {
    const cell = cells[i];
    w_tr.elements.push(getTableCellXmlObj(cell));
  }
  return w_tr;
};
