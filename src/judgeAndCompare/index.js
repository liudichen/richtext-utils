/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 22:51:18
 * @LastEditTime: 2022-11-07 10:14:19
 */
export const isAllChineseWord = (str) => /^[\u4e00-\u9fa5]+$/.test(str);
export const hasChineseWord = (str) => /[\u4e00-\u9fa5]+/.test(str);
export const isHexColor = (color) => /^#?([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color);
export const isRgbColor = (color) => /^(rgb|RGB)/.test(color);
export const isHslColor = (color) => /^(hsl|HSL)/.test(color);
export const isWordColor = (color) => /^[a-z]+[A-Za-z]+[a-z]$/.test(color) && !isHexColor(color);

export const isBase64Image = (str) => /^data:image\//.test(str);
