/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:43:37
 * @LastEditTime: 2022-10-27 22:46:16
 */

import { IGetParagraphXmlElementParams } from 'src/types';

/**
 * html style中段落间距相关的尺寸大小转 word xml属性的数值大小
 * ```
 *  支持格式：
 * 1. 数字(视为px)
 * 2. 文本(单位：px、%、pt、gd、cm)
 * ```
 * ```
 * 主要的关联属性：
 * mso-para-margin-top： w:beforeLines
 * mso-para-margin-bottom： w:afterLines
 * mso-para-margin-right： gd-> w:ind-w:rightChars cm/pt -> w:ind-w:right
 * mso-para-margin-left: gd-> w:ind-w:leftChars cm/pt -> w:ind-w:left
 * line-height： /w:line
 * text-indent：负数时w:ind-w:hanging,
 * text-indent: 正数  w:ind-w:firstLine
 * mso-char-indent-count: w:ind-w:firstLineChars
 * ```
 * */
export const htmlParagraphSizeToWordSizeNumber: (size: string | number) => number | undefined;

/** 将style里的margin字符串（可能有1-4个值）切分成4个，
 * ```
 * 结果：[上, 右, 下, 左] = [string, string, string, string]
 * ```
*/
export const spliteMargin: (margin: string) => [string, string, string, string] | [];

/** 从段落p的style中获取生成段落的参数属性（不含items） */
export const getParagraphParams: (styles: object) => IGetParagraphXmlElementParams;
