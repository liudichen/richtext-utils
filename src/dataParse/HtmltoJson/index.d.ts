/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 16:17:05
 * @LastEditTime: 2022-10-25 12:12:31
 */
import { inlineStyleToObjectOptions, htmlToJsonOptions } from '../../types';

/** 将属性名称由-间隔模式转化为小驼峰式 */
export const camelCase: (key: string) => string;

/** 将属性名称由-间隔模式转化为大驼峰式 */
export const pascalCase: (key: string) => string;

/** 将内联样式文本转化为对象 */
export const inlineStyleToObject: (style: string, options?: inlineStyleToObjectOptions) => object;

/** 将html字符串转化为对象 */
export const htmlToJson: (html: string, options?: htmlToJsonOptions) => jsonItem[];
