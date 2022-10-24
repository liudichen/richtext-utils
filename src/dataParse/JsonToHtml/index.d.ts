/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 17:37:22
 * @LastEditTime: 2022-10-24 17:41:12
 */

import { jsonItem } from '../HtmltoJson';

/** 将驼峰形式命名转化为下划线命名 */
export const underlineCase: (key: string) => string;

/** 将json转化为html */
export const jsonToHtml: (json: jsonItem | jsonItem[]) => string;
