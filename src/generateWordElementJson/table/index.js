/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 16:25:39
 * @LastEditTime: 2022-10-27 20:08:19
 */


// 待处理，行高等属性，合并单元格的验证


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
