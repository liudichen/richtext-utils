// from  https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/color/tinyColor.less

/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { colorNameHexs as names } from '../colorDef';
import { trimLeft, trimRight, matchers } from '../regExps';
import { parseIntFromHex, convertHexToDecimal, bound01, pad2, convertDecimalToHex, boundAlpha } from '../numericalHandler';

export const stringInputToObject = (color) => {
  color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
  let named = false;
  // @ts-ignore
  if (names[color]) {
  // @ts-ignore
    color = names[color];
    named = true;
  } else if (color === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
  }

  // Try to match string input using regular expressions.
  // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the tinycolor is initialized with string or object.
  let match;
  if ((match = matchers.rgb.exec(color))) {
    return { r: match[1], g: match[2], b: match[3] };
  }
  if ((match = matchers.rgba.exec(color))) {
    return { r: match[1], g: match[2], b: match[3], a: match[4] };
  }
  if ((match = matchers.hsl.exec(color))) {
    return { h: match[1], s: match[2], l: match[3] };
  }
  if ((match = matchers.hsla.exec(color))) {
    return { h: match[1], s: match[2], l: match[3], a: match[4] };
  }
  if ((match = matchers.hsv.exec(color))) {
    return { h: match[1], s: match[2], v: match[3] };
  }
  if ((match = matchers.hsva.exec(color))) {
    return { h: match[1], s: match[2], v: match[3], a: match[4] };
  }
  if ((match = matchers.hex8.exec(color))) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? 'name' : 'hex8',
    };
  }
  if ((match = matchers.hex6.exec(color))) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? 'name' : 'hex',
    };
  }
  if ((match = matchers.hex4.exec(color))) {
    return {
      r: parseIntFromHex(match[1] + '' + match[1]),
      g: parseIntFromHex(match[2] + '' + match[2]),
      b: parseIntFromHex(match[3] + '' + match[3]),
      a: convertHexToDecimal(match[4] + '' + match[4]),
      format: named ? 'name' : 'hex8',
    };
  }
  if ((match = matchers.hex3.exec(color))) {
    return {
      r: parseIntFromHex(match[1] + '' + match[1]),
      g: parseIntFromHex(match[2] + '' + match[2]),
      b: parseIntFromHex(match[3] + '' + match[3]),
      format: named ? 'name' : 'hex',
    };
  }

  return false;
};

// hslToRgb
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
export const hslToRgb = (h, s, l) => {
  let r,
    g,
    b;

  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
};

/** Converts an RGB color value to HSV
*Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
*Returns:* { h, s, v } in [0,1]
**/
export const rgbToHsv = (r, g, b) => {

  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h;
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    // eslint-disable-next-line default-case
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, v };
};

/** Converts an HSV color value to RGB.
*Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
*Returns:* { r, g, b } in the set [0, 255]
*/
export const hsvToRgb = (h, s, v) => {

  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);

  const i = Math.floor(h),
    f = h - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    mod = i % 6,
    r = [ v, q, p, p, t, v ][mod],
    g = [ t, v, v, q, p, p ][mod],
    b = [ p, p, t, v, v, q ][mod];

  return { r: r * 255, g: g * 255, b: b * 255 };
};

/** Converts an RGB color to hex
Assumes r, g, and b are contained in the set [0, 255]
Returns a 3 or 6 character hex
*/
export const rgbToHex = (r, g, b, allow3Char) => {

  const hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
  ];

  // Return a 3 character hex if possible
  if (allow3Char && hex[0].charAt(0) === hex[0].charAt(1) && hex[1].charAt(0) === hex[1].charAt(1) && hex[2].charAt(0) === hex[2].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }

  return hex.join('');
};

/** Converts an RGBA color plus alpha transparency to hex
Assumes r, g, b are contained in the set [0, 255] and
a in [0, 1]. Returns a 4 or 8 character rgba hex
*/
export const rgbaToHex = (r, g, b, a, allow4Char) => {

  const hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
    pad2(convertDecimalToHex(a)),
  ];

  // Return a 4 character hex if possible
  if (allow4Char && hex[0].charAt(0) === hex[0].charAt(1) && hex[1].charAt(0) === hex[1].charAt(1) && hex[2].charAt(0) === hex[2].charAt(1) && hex[3].charAt(0) === hex[3].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }

  return hex.join('');
};

/** Converts an RGBA color to an ARGB Hex8 string
Rarely used, but required for "toFilter()"
*/
export const rgbaToArgbHex = (r, g, b, a) => {

  const hex = [
    pad2(convertDecimalToHex(a)),
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
  ];

  return hex.join('');
};


// isValidCSSUnit
// Take in a single string / number and check to see if it looks like a CSS unit
// (see matchers above for definition).
const isValidCSSUnit = (color) => !!matchers.CSS_UNIT.exec(color);


// rgbToRgb
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255,
  };
}
// Replace a decimal with it's percentage value
function convertToPercentage(n) {
  if (n <= 1) {
    n = (n * 100) + '%';
  }

  return n;
}

/** Given a string or object, convert that input to RGB
@example
```
Possible string inputs:
"red"
"#f00" or "f00"
"#ff0000" or "ff0000"
"#ff000000" or "ff000000"
"rgb 255 0 0" or "rgb (255, 0, 0)"
"rgb 1.0 0 0" or "rgb (1, 0, 0)"
"rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
"rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
"hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
"hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
"hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
```
*/
export const inputToRGB = (color) => {
  let rgb = { r: 0, g: 0, b: 0 };
  let a = 1;
  let s = null;
  let v = null;
  let l = null;
  let ok = false;
  let format = false;

  if (typeof color === 'string') {
    color = stringInputToObject(color);
  }

  if (typeof color === 'object') {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).slice(-1) === '%' ? 'prgb' : 'rgb';
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = 'hsv';
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = 'hsl';
    }

    if (color.hasOwnProperty('a')) {
      a = color.a;
    }
  }

  a = boundAlpha(a);

  return {
    ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a,
  };
};
