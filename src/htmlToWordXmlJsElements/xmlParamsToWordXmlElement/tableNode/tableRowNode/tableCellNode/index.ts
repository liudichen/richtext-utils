import type { XmlElementGenerationConfig, XmlNode, HtmlXmlParamsTableCell, HtmlXmlParamsImageNode, HtmlXmlParamsParagrapNode, HtmlXmlParamsTableNode } from '@/types/index';

import { imageXmlParamsNodeToXmlElementObj } from '../../../imageNode';
import { paragraphXmlParamsNodeToXmlElementObj } from '../../../paragraphNode';
import { tableXmlParamsNodeToXmlElementObj } from '../..';

const getCellBordersXmlObj = (borders) => {
  if (!borders || typeof borders !== 'object' || !Object.keys(borders).length) return;
  const w_tcBorders: XmlNode = { type: 'element', name: 'w:tcBorders', elements: [] };
  const keys = Object.keys(borders);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const { val, sz, space, color } = borders[k];
    const borderInfo: XmlNode = {
      type: 'element', name: `w:${k}`, attributes: {},
    };
    if (val) borderInfo.attributes['w:val'] = val;
    if (val !== 'nil') {
      if (typeof sz !== 'undefined') borderInfo.attributes['w:sz'] = `${sz}`;
      borderInfo.attributes['w:space'] = `${space || 0}`;
      if (color) borderInfo.attributes['w:color'] = `${color}`;
    }
    w_tcBorders.elements.push(borderInfo);
  }
  return w_tcBorders;
};

/**
 * 解析并转换后的表格单元格的xml参数节点转换为xml的js对象
 * ```
`如果单元格被合并，则在html中合并的单元格中仅左上角的坐标位置会有th/tc，用colspan、rowspan来确定水平、垂直合并的格子数量，其他被合并的位置都没有元素。

xml中，水平合并的单元格仅左侧位置有w:tc元素且通过w:gridSpan确定水平合并的单元格数量,
垂直合并的每个单元格都会有w:tc元素,w:tc元素均标识w:vMerge,但仅最上方的单元格有文本内容且w:vMerge有属性w:val="restart"

导致的结果是html和xml的行数相同，但每行的tc元素并不相等（xml多了那些被从上方的单元格合并了的格子）`
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const tableCellXmlParamsNodeToXmlElementObj = (tableCellNode: HtmlXmlParamsTableCell, config?: XmlElementGenerationConfig) => {
  const {
    colspan,
    vMerge, vMergeRestart,
    content,
    width,
    borders,
    vAlign,
  } = tableCellNode;
  const w_tcPr: XmlNode = { type: 'element', name: 'w:tcPr', elements: [
    { type: 'element', name: 'w:tcW', attributes: { 'w:w': '0', 'w:type': 'auto' } },
  ] };
  if (+width) { w_tcPr.elements[0].attributes = { 'w:w': `${width}`, 'w:type': 'dxa' }; }
  if (vMergeRestart || vMergeRestart) {
    const w_vMerge: XmlNode = { type: 'element', name: 'w:vMerge', elements: [] };
    if (vMergeRestart) w_vMerge.attributes = { 'w:val': 'restart' };
    w_tcPr.elements.push(w_vMerge);
  }
  if (+colspan) w_tcPr.elements.push({ type: 'element', name: 'w:gridSpan', attributes: { 'w:val': `${colspan}` } });
  const w_tcBorders = getCellBordersXmlObj(borders);
  if (w_tcBorders) w_tcPr.elements.push(w_tcBorders);
  if (vAlign === 'center' || vAlign === 'bottom') w_tcPr.elements.push({ type: 'element', name: 'w:vAlign', attributes: { 'w:val': vAlign } });
  const w_tc: XmlNode = { type: 'element', name: 'w:tc', elements: [
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
        w_tc.elements.push(paragraphXmlParamsNodeToXmlElementObj(content[i] as HtmlXmlParamsParagrapNode, config));
      } else if (type === 'image') {
        w_tc.elements.push(imageXmlParamsNodeToXmlElementObj(content[i] as HtmlXmlParamsImageNode, config));
      } else if (type === 'table') {
        w_tc.elements.push(...tableXmlParamsNodeToXmlElementObj(content[i] as HtmlXmlParamsTableNode, config));
      }
    }
  } return w_tc;
};
