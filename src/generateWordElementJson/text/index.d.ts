/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 22:13:05
 * @LastEditTime: 2022-10-25 22:33:07
 */
import { IWordElement } from 'src/types';

/** 文本中是否含有中文字符 */
export const hasChineseWord: (str: string) => boolean;

/** 文本全部为中文字符 */
export const isAllChineseWord: (str: string) => boolean;

export interface IGetTextElementParams {
  /** 字体
   * @defaultValue 宋体
   */
  fontFamily?: string,
  /** 字号
   * @defaultValue 24
   */
  fontSize?: number | string,
  /** 文本 */
  text: string,
  /** 是否加粗 */
  bold?: boolean,
  /** 字体颜色 */
  color?: string,
  /** 是否斜体 */
  italic?: boolean,
  /** 下划线类型 */
  underline?: string,
  /** 是否有文字删除线 */
  strike?: boolean,
  /** 文字高亮的背景颜色 */
  backgroundColor?: string,
  /** 下标? */
  sub?: boolean,
  /** 上标? */
  sup?: boolean,
  /** 是否有文字底纹 */
  shd?: boolean,
}

export const getTextElement: (params: IGetTextElementParams) => IWordElement;
