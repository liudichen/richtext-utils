/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 20:07:33
 * @LastEditTime: 2022-11-08 23:52:13
 */
import { getParagraphXmlElementObj } from '../../paragraph';
import { getImageXmlElementObj } from '../../image';
import { getTableXmlElementObj } from '../index';

//  <w:tcBorders>
//               <w:top w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:left w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto"/>
//               <w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>
//             </w:tcBorders>
const getCellBordersXmlObj = (borders) => {
  if (!borders || typeof borders !== 'object' || !Object.keys(borders).length) return;
  const w_tcBorders = { type: 'element', name: 'w:tcBorders', elements: [] };
  const keys = Object.keys(borders);
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
    w_tcBorders.elements.push(borderInfo);
  }
  return w_tcBorders;
};

export const getTableCellXmlObj = (params) => {
  const {
    colspan, // 水平单元格合格
    vMerge,
    vMergeRestart,
    content,

    width,
    borders,
    vAlign, // 单元格的垂直对齐方式， word里默认是top，html里默认是center,对应th，tc属性的vertical-align:bottom/top，center时style里没有。水平对齐由下面的段落控制。
  } = params || {};
  const w_tcPr = { type: 'element', name: 'w:tcPr', elements: [
    { type: 'element', name: 'w:tcW', attributes: { 'w:w': '0', 'w:type': 'auto' } },
  ] };
  if (+width) { w_tcPr.elements[0].attributes = { 'w:w': `${width}`, 'w:type': 'dxa' }; }
  if (vMergeRestart || vMergeRestart) {
    const w_vMerge = { type: 'element', name: 'w:vMerge', elements: [] };
    if (vMergeRestart) w_vMerge.attributes = { 'w:val': 'restart' };
    w_tcPr.elements.push(w_vMerge);
  }
  if (+colspan) w_tcPr.elements.push({ type: 'element', name: 'w:gridSpan', attributes: { 'w:val': `${colspan}` } });
  const w_tcBorders = getCellBordersXmlObj(borders);
  if (w_tcBorders) w_tcPr.elements.push(w_tcBorders);
  if (vAlign === 'center' || vAlign === 'bottom') w_tcPr.elements.push({ type: 'element', name: 'w:vAlign', attributes: { 'w:val': vAlign } });
  const w_tc = { type: 'element', name: 'w:tc', elements: [
    w_tcPr,
  ] };
  if (vMerge || !content?.length || !content.filter((ele) => !!ele).length) {
    w_tc.elements.push({
      type: 'element',
      name: 'w:p',
      elements: [],
    });
  } else {
    for (let i = 0; i < content.length; i++) {
      if (!content[i]) continue;
      const { type } = content[i];
      if (type === 'p') {
        w_tc.elements.push(getParagraphXmlElementObj(content[i]));
      } else if (type === 'image') {
        w_tc.elements.push(getImageXmlElementObj(content[i]));
      } else if (type === 'table') {
        w_tc.elements.push(getTableXmlElementObj(content[i]));
      }
    }
  } return w_tc;
};

// html中和word的xml文件明显差别：
`
如果单元格被合并，则在html中合并的单元格中仅左上角的坐标位置会有th/tc，用colspan、rowspan来确定水平、垂直合并的格子数量，其他被合并的位置都没有元素。

xml中，水平合并的单元格仅左侧位置有w:tc元素且通过w:gridSpan确定水平合并的单元格数量,
垂直合并的每个单元格都会有w:tc元素,w:tc元素均标识w:vMerge,但仅最上方的单元格有文本内容且w:vMerge有属性w:val="restart"

导致的结果是html和xml的行数相同，但每行的tc元素并不相等（xml多了那些被从上方的单元格合并了的格子）
`;
