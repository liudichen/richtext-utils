/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 20:14:21
 * @LastEditTime: 2022-11-12 17:43:59
 */
/**
 * html style中段落间距相关的尺寸大小转 word xml属性的数值大小
 * @param wordPtFontSize - 可选,用于辅助处理单位为gd或em时的缩进大小
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
export declare const htmlSpacingSizeToWordSizeNumber: (size: string | number, wordPtFontSize?: number) => number | undefined;

/** 将style里的margin字符串（可能有1-4个值）切分成4个，
 * ```
 * 结果：[上, 右, 下, 左] = [string, string, string, string]
 * ```
*/
export declare const splitHtmlMarginString: (margin: string) => [string, string, string, string] | [];

