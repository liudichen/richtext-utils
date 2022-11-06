/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-11-06 18:17:36
 * @LastEditTime: 2022-11-06 18:20:01
 */
interface IGetCoreXmlJsParams {
  /** 外部传入原始coreJ，可选 */
  coreJs?: object,
  /** 更新信息? */
  update?: boolean,
  creator?: string,
  title?: string,
  subject?: string,
  revision?: number | string
}

/** 生成docx解压后的 docProps - core.xml 文件内容*/
export const getCoreXmlJs: (params: IGetCoreXmlJsParams) => object;
