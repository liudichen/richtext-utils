import { IGetParagraphXmlElementParams } from '..';

/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 15:31:34
 * @LastEditTime: 2022-11-07 20:40:42
 */
interface IGetTableCellXmlElementParams {
  type: 'tc',
  content?: IGetParagraphXmlElementParams[],
  colspan?: number,
  vAlign?: boolean,
  width?: number,
  vMergeRestart?: boolean,
  vMerge?: boolean,
}

interface IGetTbleRowXmlElementParams {
  type: 'tr',
  isHeader?: boolean,
  isFooter?: boolean,
  cantSplit?: boolean,
  height?: number,
  cells: IGetTableCellXmlElementParams[],
}

export interface IGetTableXmlElementParams {
  type: 'table',
  height?: number,
  width?: number,
  cols: number,
  colWidths?: number[],
  ind?: string | number | object,
  layout?: 'fixed',
  align?: 'left' | 'center' | 'right',
  rows: IGetTbleRowXmlElementParams[]
}
