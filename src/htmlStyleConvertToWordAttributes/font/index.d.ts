/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-28 09:36:48
 * @LastEditTime: 2022-11-07 22:14:47
 */
/** html style里的字体大小转化为word里xml的大小（xml的数值是正常pt值的2倍）
 * 支持单位 px/pt，数字会被认为是px
 */
export declare const htmlFontSizeToWordFontSizeNumber: (fontSize: string | number) => number;

/**
 * 从style对象中获取字体
 * @param styles- style对象（属性名不是驼峰式的）
 * @param onlyHans- 为真（默认）时，当没有font-family时是否从其他字体属性中找汉语字体，如果没有就不返回；为假时有限找汉语字体，没有就返回第1个字体
 * @returns 字体strng 或 undefined
 */
export declare const getFontFamilyFromHtmlStyleObj: (styles: object, onlyHans?: boolean) => string | undefined;
