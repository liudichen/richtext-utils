/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-11-06 18:17:36
 * @LastEditTime: 2022-11-07 22:12:00
 */
interface IGetCoreXmlJsParams {
  /** 外部传入原始coreJ，可选 */
  coreJs?: object,
  /** 更新信息? */
  update?: boolean,
  creator?: string,
  updator?: string,
  title?: string,
  subject?: string,
  revision?: number | string
}

/** 生成docx解压后的 docProps - core.xml 文件内容*/
export declare const getCoreXmlJs: (params: IGetCoreXmlJsParams) => object;
