/*
 * @Description: 
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-24 14:37:17
 * @LastEditTime: 2022-10-24 14:43:46
 */
import { defineConfig } from 'father';

export default defineConfig({
  esm: { input: 'src' },
  cjs: { input: 'src' },
  prebundle: {},
});
