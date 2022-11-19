/* eslint-disable @typescript-eslint/ban-ts-comment */

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
export const isOnePointZero = (n: unknown) => typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;

// Check to see if string passed in is a percentage
export const isPercentage = (n: unknown) => typeof n === 'string' && n.indexOf('%') !== -1;

// Take input from [0, n] and return it as [0, 1]
export const bound01 = (n: string | number, max: number) => {
  if (isOnePointZero(n)) { n = '100%'; }

  const processPercent = isPercentage(n);
  // @ts-ignore
  let num = Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (processPercent) {
    // @ts-ignore
    num = parseInt(num * max, 10) / 100;
  }

  // Handle floating point rounding errors
  if ((Math.abs(num - max) < 0.000001)) {
    return 1;
  }
  // Convert into [0, 1] range if it isn't already
  // @ts-ignore
  return (num % max) / parseFloat(max);
};

// Force a hex value to have 2 characters
export const pad2 = (c: string) => (c.length === 1 ? '0' + c : '' + c);

// Parse a base-16 hex value into a base-10 integer
export const parseIntFromHex = (val:string) => parseInt(val, 16);

// Replace a decimal with it's percentage value
export const convertToPercentage = (n : number) => ((n <= 1) ? (n * 100) + '%' : n);

// Converts a decimal to a hex value
// @ts-ignore
export const convertDecimalToHex = (d: string | number) => Math.round(parseFloat(d) * 255).toString(16);

// Converts a hex value to a decimal
export const convertHexToDecimal = (h: string) => (parseIntFromHex(h) / 255);

// Return a valid alpha value [0,1] with all invalid values being set to 1
export const boundAlpha = (av: string) => {
  let a = parseFloat(av);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
};


// Force a number between 0 and 1
export const clamp01 = (val: number) => Math.min(1, Math.max(0, val));

