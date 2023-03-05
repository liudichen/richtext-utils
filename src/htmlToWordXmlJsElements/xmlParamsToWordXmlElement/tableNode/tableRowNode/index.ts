import type { XmlElementGenerationConfig, XmlNode, HtmlXmlParamsTableRow } from '@/types/index';

import { tableCellXmlParamsNodeToXmlElementObj } from './tableCellNode';

/**
 * 解析并转换后的表格行的xml参数节点转换为xml的js对象
```
`虽然xml里可以有行w:jc(https://learn.microsoft.com/zh-cn/dotnet/api/documentformat.openxml.wordprocessing.tablerowproperties?view=openxml-2.8.1),但粘贴的html里没有行的水平对齐方式的属性`
```
 */
export const tableRowXmlParamsNodeToXmlElementObj = (tableRowNode: HtmlXmlParamsTableRow, config?: XmlElementGenerationConfig) => {
  const {
    cantSplit,
    isHeader,
    height,
    cells,
  } = tableRowNode;
  let w_trPr = null;
  if (cantSplit || isHeader || height) {
    w_trPr = { type: 'element', name: 'w:trPr', elements: [] };
    if (cantSplit) w_trPr.elements.push({ type: 'element', name: 'w:cantSplit', elements: [] });
    if (isHeader) w_trPr.elements.push({ type: 'element', name: 'w:tblHeader', elements: [] });
    if (+height) w_trPr.elements.push({ type: 'element', name: 'w:trHeight', attributes: { 'w:val': `${+height}` } });
  }
  const w_tr: XmlNode = { type: 'element', name: 'w:tr', elements: [] };
  if (w_trPr) w_tr.elements.push(w_trPr);
  for (let i = 0; i < cells?.length; i++) {
    const cell = cells[i];
    w_tr.elements.push(tableCellXmlParamsNodeToXmlElementObj(cell, config));
  }
  return w_tr;
};
