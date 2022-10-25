/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 22:51:11
 * @LastEditTime: 2022-10-25 22:52:44
 */

/** 文本中是否含有中文字符 */
export const hasChineseWord: (str: string) => boolean;

/** 文本全部为中文字符 */
export const isAllChineseWord: (str: string) => boolean;

/** 判断是否为16进制颜色,可以带#也可以不带 */
export const isHexColor: (color: string) => boolean;

/** 判断是否为rgb颜色 */
export const isRgbColor: (color: string) => boolean;

/** 判断是否为hsl颜色 */
export const isHslColor: (color: string) => boolean;

/** 判断是否为单词颜色 */
export const isWordColor: (color: string) => boolean;
