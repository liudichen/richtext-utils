/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-11-07 09:48:31
 * @LastEditTime: 2022-11-07 11:26:18
 */
import { ignoreTags } from '../../htmlStringToXmlElementParams';
import { ensureImageCxCy, getImageXmlElementObj } from '../image';
import { isBase64Image } from '../../judgeAndCompare';
import { htmlToJson } from '../../JsonAndHtml';

const getImageStepParamsExample = async (imgStepOneParams, config) => {
  const { cx, cy, step, src } = imgStepOneParams;
  if (!src) return;
  const { maxImgCx, maxImgCy } = config || {};
  let stepTwoParams = {};
  if (cx && cy) {
    stepTwoParams = { cx, cy };
    if (maxImgCx || maxImgCy) {
      stepTwoParams = ensureImageCxCy(cx, cy, maxImgCx, maxImgCy);
    }
  }
  if (step === 0) {
    if (isBase64Image) {
      // 生成blob
    } else {
      //
    }
    // 这里处理图片文件、rels等
  }
  return stepTwoParams;
};

const htmlStringToXmlJsonElements = async (htmlStr, config, getImgStepTwoParamsFn) => {
  const elements = [];
  const jsonArr = htmlToJson(htmlStr, { skipComment: true, skipScript: true, skipStyle: true, keepInlineStyle: true, keepClass: false, keepRawInlineStyle: false, styleCamelCase: false }, config);
  for (let i = 0; i < jsonArr?.length; i++) {

  }
};
