/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 22:33:03
 * @LastEditTime: 2022-10-27 22:34:25
 */
interface IGetImageStepOneParams {
  type: 'image',
  width?: string | number,
  height?: string | number,
  src?: string,
  style?: object,
}
interface IImageStepOneParam {
  type: 'image',
  step: 0,
  cx?: number,
  cy?: number,
  src: string,
}
/**  获取图片的阶段1的参数，后续还需要处理图片rId或获取图片尺寸
 *  如果入参里有宽高尺寸则会将其转化为cx,cy
 * 否则需要后续获取图片实际宽高并另行处理
 * ```
 *  StepTwo就是获取cx,cy(如果有就不需要)及移动图片获取rId等操作，后续这些操作是在生成xml文档时进行的
 * ```
*/
export const getImageStepOneParams: (params: IGetImageStepOneParams) => IImageStepOneParam;
