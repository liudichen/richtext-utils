/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 23:39:38
 * @LastEditTime: 2022-10-28 16:03:05
 */
import { DefaultNodeStructOptions } from '../../JsonAndHtml';
import { htmlJsonNodeParser } from '..';
import { paragraphHtmlJsonNodeParser } from '../paragraph';
import { htmlSpacingSizeToWordSizeNumber } from '../../htmlStyleConvertToWordAttributes';

const getTableCellContentXmlJsonParams = (content, nodeStructOptions) => {
  const { NODENAME, CHILDREN, STYLE } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  let data = [];
  if (!content.length || content.map((ele) => ele[NODENAME] === 'span') === content.length) {
    data = paragraphHtmlJsonNodeParser({ type: 'p', [STYLE]: {}, [CHILDREN]: content }, nodeStructOptions);
  } else {
    data = content.map((ele) => htmlJsonNodeParser(ele, nodeStructOptions));
  }
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (Array.isArray(node)) {
      result.push(...node);
    } else {
      result.push(node);
    }
  }
  return result;
};

// eslint-disable-next-line no-unused-vars
export const tableHtmlJsonNodeParser = (node, nodeStructOptions) => {
  const { NODENAME, CHILDREN, STYLE, ATTRIBUTES } = Object.assign({ ...DefaultNodeStructOptions }, nodeStructOptions);
  const { [CHILDREN]: blocks = [], [STYLE]: style = {}, [ATTRIBUTES]: attributes = {} } = node;
  const gridCols = [];
  let cols = 0;
  let TRs = [];
  const thead = blocks.find((ele) => ele[NODENAME] === 'thead');
  const tbody = blocks.find((ele) => ele[NODENAME] === 'tbody');
  const tfoot = blocks.find((ele) => ele[NODENAME] === 'tfoot');
  if (thead?.[CHILDREN]?.length) { TRs = [ ...TRs, ...thead[CHILDREN].map((ele) => ({ ...ele, isHeader: true })) ]; }
  if (tbody?.[CHILDREN]?.length) { TRs = [ ...TRs, ...tbody[CHILDREN] ]; }
  if (tfoot?.[CHILDREN]?.length) { TRs = [ ...TRs, ...tfoot[CHILDREN].map((ele) => ({ ...ele, isFooter: true })) ]; }
  if (!TRs.length) return false;
  //  ===== ↓ table 属性 ↓ =====
  const tableData = { type: 'table' };
  if (attributes?.height || style?.height) {
    tableData.height = htmlSpacingSizeToWordSizeNumber(attributes?.height) || htmlSpacingSizeToWordSizeNumber(style?.height);
  }
  const tableStruct = TRs.map(() => ({ type: 'tr', cells: [] }));
  // =====================
  for (let i = 0; i < TRs.length; i++) {
    const row = TRs[i];
    const { [CHILDREN]: cells, isFooter, isHeader } = row;
    // ====== ↓ tr的自己属性 ↓ ====
    if (isFooter) tableStruct[i].isFooter = true;
    if (isHeader) tableStruct[i].isHeader = true;
    if (row[STYLE]?.['page-break-inside'] === 'avoid') tableStruct[i].cantSplit = true;
    if (row[STYLE]?.height) tableStruct[i].height = htmlSpacingSizeToWordSizeNumber(row[STYLE].height);
    // ======= ↑ ↑ =======
    for (let j = 0; j < cells.length; j++) {
      const { [CHILDREN]: content, [STYLE]: style, [ATTRIBUTES]: attributes } = cells[j];
      const cellData = {};
      const commonData = {};
      const { 'vertical-align': vAlign, width: widthS } = style || {};
      let { colspan, rowspan, width: widthA } = attributes || {};
      // ===== 处理单元格属性 =====
      colspan = +colspan; rowspan = +rowspan;
      if (colspan > 1) commonData.colspan = colspan;
      // 单元格的垂直对齐方式， word里默认是top，html里默认是center,对应th，tc属性的vertical-align:bottom/top，center时style里没有。水平对齐由下面的段落控制。
      if (vAlign !== 'top') { commonData.vAlign === vAlign || 'center'; }
      let width = 0;
      if (+widthA || widthS) {
        width = htmlSpacingSizeToWordSizeNumber(widthA) || htmlSpacingSizeToWordSizeNumber(widthS);
        commonData.width = width;
      }
      if (rowspan > 1) {
        cellData.vMergeRestart = true;
      }
      // ***********************
      // !!!!!!!! 预留位置： 边框处理
      // **********************
      cellData.content = getTableCellContentXmlJsonParams(content, nodeStructOptions);
      if (i === 0) {
        cols = cols + (+colspan || 1);
        gridCols.push(width);
      }
      tableStruct[i].cells.push({ type: 'tc', ...commonData, ...cellData });
      if (rowspan > 1) {
        const mergeData = { ...commonData, vMerge: true };
        for (let k = 1; k < rowspan; k++) {
          tableStruct[i + k].cells.push({ type: 'tc', ...mergeData });
        }
      }
    }
  }
  tableData.rows = tableStruct;
  return tableData;
};
