/*
 * @Description
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-25 15:59:10
 * @LastEditTime: 2022-11-06 18:25:22
 */

/*
生成的Json数据是用于使用xml-js的js2xml方法生成xml文件,
  转化时的参数为：
    const js2XmlOptions = {
      compact: false,
      ignoreComment: true,
      space: 2,
      fullTagEmptyElement: true,
    };
  节点数据样式:{
    {
      type: 'element',
      name: 'w:tblStyle',
      attributes: {
        'w:val': 'a6',
      },
      elements: [],
    },
  }
 */
export * from './paragraph';
export * from './text';
export * from './meta';
export * from './constant';
