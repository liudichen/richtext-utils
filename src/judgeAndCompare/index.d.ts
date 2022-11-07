/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 22:51:11
 * @LastEditTime: 2022-11-07 22:15:55
 */

/** 文本中是否含有中文字符 */
export declare const hasChineseWord: (str: string) => boolean;

/** 文本全部为中文字符 */
export declare const isAllChineseWord: (str: string) => boolean;

/** 判断是否为16进制颜色,可以带#也可以不带 */
export declare const isHexColor: (color: string) => boolean;

/** 判断是否为rgb颜色 */
export declare const isRgbColor: (color: string) => boolean;

/** 判断是否为hsl颜色 */
export declare const isHslColor: (color: string) => boolean;

/** 判断是否为单词颜色 */
export declare const isWordColor: (color: string) => boolean;

/** 判断是否是base64图片 */
export declare const isBase64Image: (str: string) => boolean;
