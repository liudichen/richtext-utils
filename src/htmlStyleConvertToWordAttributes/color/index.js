/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 18:21:46
 * @LastEditTime: 2022-10-25 22:53:06
 */
import { isHexColor, isHslColor, isRgbColor, isWordColor } from '../../judgeAndCompare';

// HSL颜色值转换为RGB.* 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.* h, s, 和 l 设定在 [0, 1] 之间* 返回的 r, g, 和 b 在 [0, 255]之间
const hue2rgb = (p, q, t) => {
  let d = p;
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) {
    d = p + (q - p) * 6 * t;
  } else if (t < 1 / 2) {
    d = q;
  } else if (t < 2 / 3) {
    d = p + (q - p) * (2 / 3 - t) * 6;
  }
  return Math.round(255 * d);
};
const getRGB = (rgb) => {
  return rgb
    .replace(/[^\d,.]/g, '')
    .split(',')
    .map((ele) => parseInt(ele));
};
const hex2RGB = (hex) => {
  hex = hex
    .replace(/^#/, '')
    .toLowerCase()
    .split('');
  if (hex.length === 3) {
    return hex.map((ele) => parseInt(`0x${ele}${ele}`));
  }
  return [ 0, 2, 4 ].map((i) => parseInt(`0x${hex[i]}${hex[i + 1]}`));
};
const RGB2Hex = (RGB) => {
  return RGB
    .map((ele) => {
      const hex = Number(ele).toString(16);
      if (hex.length < 2) return '0' + hex;
      return hex;
    })
    .join('');
};
const getHSL = (hsl) =>
  hsl
    .replace(/[^\d%,.]+/g, '')
    .split(',')
    .map((ele) => {
      if (!ele) return 0;
      return ele.endsWith('%') ? (+ele.slice(0, ele.length - 1) / 100 || 0) : (+ele || 0);
    });
const HSL2RGB = (HSL) => {
  const [ h, s, l ] = HSL;
  let r = 0,
    g = 0,
    b = 0;
  if (s === 0) {
    r = g = b = 255;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
    return [ r, g, b ];
  }
};
const RGB2HSL = (RGB) => {
  let [ r, g, b ] = RGB;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [ h, s, l ];
};

export const rgbColor2HexColor = (rgb, options) => {
  const { noSharp, upperCase } = Object.assign({ noSharp: false, upperCase: false }, options);
  const RGB = getRGB(rgb);
  let hex = RGB2Hex(RGB);
  if (upperCase) hex = hex.toUpperCase();
  return noSharp ? hex : `#${hex}`;
};

export const hexColor2RgbColor = (hex, options) => {
  const { upperCase } = Object.assign({ upperCase: false }, options);
  const RGB = hex2RGB(hex);
  return `${upperCase ? 'RGB' : 'rgb'}(${RGB.join(',')})`;
};

export const hslColor2RgbColor = (hsl, options) => {
  const { upperCase } = Object.assign({ upperCase: false }, options);
  const HSL = getHSL(hsl);
  const RGB = HSL2RGB(HSL);
  return `${upperCase ? 'RGB' : 'rgb'}(${RGB.join(',')})`;
};

export const rgbColor2HslColor = (rgb, options) => {
  const { upperCase } = Object.assign({ upperCase: false }, options);
  const RGB = getRGB(rgb);
  const HSL = RGB2HSL(RGB);
  return `${upperCase ? 'HSL' : 'hsl'}(${HSL.join(',')})`;
};

export const hslColor2HexColor = (hsl, options) => {
  const { noSharp, upperCase } = Object.assign({ noSharp: false, upperCase: false }, options);
  const HSL = getHSL(hsl);
  const RGB = HSL2RGB(HSL);
  let hex = RGB2Hex(RGB);
  if (upperCase) hex = hex.toUpperCase();
  return noSharp ? hex : `#${hex}`;
};

export const hexColor2HslColor = (hex, options) => {
  const { upperCase } = Object.assign({ upperCase: false }, options);
  const RGB = hex2RGB(hex);
  const HSL = RGB2HSL(RGB);
  return `${upperCase ? 'HSL' : 'hsl'}(${HSL.join(',')})`;
};

export const htmlColorToWordColor = (hColor) => {
  let color = hColor;
  if (isHexColor) {
    color = color.replace(/^#/, '').toUpperCase();
  } else if (isWordColor) {
    // 从word粘贴到ckeditor的颜色和word中自定义的颜色不一致
    switch (hColor) {
      case 'red':
        break;
      case 'black':
        break;
      case 'silver':
        color = 'lightGray';
        break;
      case 'gray':
        color = 'darkGray';
        break;
      case 'olive':
        color = 'darkYellow';
        break;
      case 'maroon':
        color = 'darkRed';
        break;
      case 'purple':
        color = 'darkMagenta';
        break;
      case 'green':
        color = 'darkGreen';
        break;
      case 'teal':
        color = 'darkCyan';
        break;
      case 'navy':
        color = 'darkBlue';
        break;
      case 'lime':
        color = 'green';
        break;
      case 'yellow':
        break;
      case 'aqua':
        color = 'cyan';
        break;
      case 'fuchsia':
        color = 'magenta';
        break;
      case 'blue':
        break;
      default:
        break;
    }
  } else if (isRgbColor) {
    color = rgbColor2HexColor(color, { noSharp: true, upperCase: true });
  } else if (isHslColor) {
    color = hslColor2HexColor(color, { noSharp: true, upperCase: true });
  }
  return color;
};
