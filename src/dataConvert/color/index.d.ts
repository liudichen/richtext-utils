/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 21:06:17
 * @LastEditTime: 2022-10-25 22:52:39
 */
interface IHslRgbOption {
  /**
   * 是否带转化为大写字母
   * @defaultValue false
   */
  upperCase?: boolean,
}

interface IHexOption extends IHslRgbOption {
  /**
   * 是否带开头的#号
   * @defaultValue false
   */
  noSharp?: boolean,
}

/** rgb颜色转化为16进制颜色，默认为带#的小写 */
export const rgbColor2HexColor: (rgb: string, options?: IHexOption) => string;

/** 16进制颜色转化为rgb颜色 */
export const hexColor2RgbColor: (hex: string, options?: IHslRgbOption) => string;

/** hsl颜色转rgb颜色 */
export const hslColor2RgbColor: (hsl: string, options?: IHslRgbOption) => string;

/** rgb颜色转hsl颜色 */
export const rgbColor2HslColor: (rgb: string, options?: IHslRgbOption) => string;

/** hsl颜色转16进制颜色，默认带#号小写 */
export const hslColor2HexColor: (hsl: string, options?: IHexOption) => string;

/** 16进制颜色转hsl颜色 */
export const hexColor2HslColor: (hex: string, options?: IHslRgbOption) => string;

/** 将html样式中的rgb/hex/hsl或单词颜色转化为word中对应的单词颜色或不带#号的大写字母16进制颜色 */
export const htmlColorToWordColor: (hColor: string) => string;
