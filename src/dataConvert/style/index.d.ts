/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-26 11:13:35
 * @LastEditTime: 2022-10-27 11:43:07
 */
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

/** html style里的字体大小转化为word里xml的大小（xml的数值是正常pt值的2倍）
 * 支持单位 px/pt，数字会被认为是px
 */
export const htmlFontSizeToWordFontSizeNumber: (fontSize: string | number) => number;

/**
 * 从style对象中获取字体
 * @param styles- style对象（属性名不是驼峰式的）
 * @param onlyHans- 为真（默认）时，当没有font-family时是否从其他字体属性中找汉语字体，如果没有就不返回；为假时有限找汉语字体，没有就返回第1个字体
 * @returns 字体strng 或 undefined
 */
export const getFontFamily: (styles: object, onlyHans?: boolean) => string | undefined;
