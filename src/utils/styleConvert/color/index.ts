import { ColorMatchers, colorToRGBObjColor, rgbToHex } from '@iimm/shared';

const WordFontColors = [
  'red', 'black', 'silver', 'gray', 'olive', 'maroon', 'purple', 'green', 'teal', 'navy', 'lime', 'yellow', 'aqua', 'fuchsia', 'blue',
];

/** 将html中的颜色转化为word中的颜色 */
export const htmlColorToWordColor = (colorStr: string) => {
  let color = colorStr;
  if (ColorMatchers.hex6.test(color)) {
    color = color.replace(/^#/, '').toUpperCase();
  } else if (WordFontColors.includes(color)) {
    // 从word粘贴到ckeditor的颜色和word中自定义的颜色不一致
    switch (color) {
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
  } else {
    const { ok, r, g, b } = colorToRGBObjColor(color);
    if (ok) {
      color = rgbToHex(r, g, b).toUpperCase();
    } else {
      color = null;
    }
  }
  return color;
};
