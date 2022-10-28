import { IGetParagraphXmlElementParams } from '..';

/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 15:31:34
 * @LastEditTime: 2022-10-28 15:43:32
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
  rows: IGetTbleRowXmlElementParams[]
}
