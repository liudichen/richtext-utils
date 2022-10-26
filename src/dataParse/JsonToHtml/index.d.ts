/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 17:37:22
 * @LastEditTime: 2022-10-26 08:44:42
 */
import { jsonItem } from '../../types';

/** 将驼峰形式命名转化为使用分隔符间隔的命名，默认分隔符是下划线_ */
export const separatorCase: (key: string,separator?: string) => string;

/** 将json转化为html */
export const jsonToHtml: (json: jsonItem | jsonItem[]) => string;
