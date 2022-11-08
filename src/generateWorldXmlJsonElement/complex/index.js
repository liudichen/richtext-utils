/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-11-07 09:48:31
 * @LastEditTime: 2022-11-08 21:00:48
 */
import { htmlStringToXmlElementGenerateParams } from '../../htmlStringToXmlElementParams';
import { getImageXmlElementObj } from '../image';
// import { isBase64Image } from '../../judgeAndCompare';
import { getParagraphXmlElementObj } from '../paragraph';
import { getTableXmlElementObj } from '../table';

// const getImageStepParamsExample = async (imgStepOneParams, config) => {
//   const { cx, cy, step, src } = imgStepOneParams;
//   if (!src) return;
//   const { maxImgCx, maxImgCy } = config || {};
//   let stepTwoParams = {};
//   if (cx && cy) {
//     stepTwoParams = { cx, cy };
//     if (maxImgCx || maxImgCy) {
//       stepTwoParams = ensureImageCxCy(cx, cy, maxImgCx, maxImgCy);
//     }
//   }
//   if (step === 0) {
//     if (isBase64Image) {
//       // 生成blob
//     } else {
//       //
//     }
//     // 这里处理图片文件、rels等
//   }
//   return stepTwoParams;
// };

export const htmlStringToXmlJsonElements = async (htmlStr, config, getImgStepTwoParamsFn) => {
  const elements = [];
  const paramsNodes = await htmlStringToXmlElementGenerateParams(htmlStr, config, getImgStepTwoParamsFn);
  for (let i = 0; i < paramsNodes.length; i++) {
    let nodes = paramsNodes[i];
    if (!Array.isArray(nodes)) nodes = [ nodes ];
    for (let j = 0; j < nodes.length; j++) {
      const node = nodes[j];
      const { type } = node;
      let xmlElements = null;
      if (type === 'p') {
        xmlElements = getParagraphXmlElementObj(node);
      } else if (type === 'image') {
        xmlElements = getImageXmlElementObj(node);
      } else if (type === 'table') {
        xmlElements = getTableXmlElementObj(node);
      }
      if (xmlElements) {
        if (Array.isArray(xmlElements)) {
          elements.push(...xmlElements);
        } else {
          elements.push(xmlElements);
        }
      }
    }
  }
  return elements;
};
