/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 15:02:21
 * @LastEditTime: 2022-10-27 10:18:32
 */
export const NODETAG = 'element';
export const NODENAME = 'name';
export const TEXTTAG = 'text';
export const TEXTVALUE = 'text';
export const COMMENTTAG = 'comment';
export const COMMENTVALUE = 'comment';
export const CHILDREN = 'elements';
export const STYLE = 'style';
export const CLASSLIST = 'classList';
export const ATTRIBUTES = 'attributes';
export const INLINESTYLE = 'inlineStyle';

export const DefaultNodeStructOptions = { NODENAME, NODETAG, TEXTTAG, TEXTVALUE, COMMENTTAG, COMMENTVALUE, CHILDREN, STYLE, CLASSLIST, ATTRIBUTES, INLINESTYLE };

export const numberValueRegexp = /^\d+$/;
export const zeroValueRegexp = /^0[^0\s].*$/;
export const scriptRegexp = /^script$/i;
export const styleRegexp = /^style$/i;
export const selfCloseTagRegexp = /^(meta|base|br|img|input|col|frame|link|area|param|embed|keygen|source)$/i;
