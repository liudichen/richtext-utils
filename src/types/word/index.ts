/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 22:16:32
 * @LastEditTime: 2022-10-25 22:17:02
 */
export interface IWordElement {
  type: 'element' | 'text',
  name: string,
  attributes?: object,
  elements: IWordElement[]
}
