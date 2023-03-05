import type { XmlNode } from '@/types/index';

interface WordCoreJsNode {
  declaration?: {
    attributes?: { [key: string]: string },
  },
  elements?: XmlNode,
}

interface WordCoreXmlJsGenerateParams {
  /** 外部传入原始coreJ，可选 */
  coreJs?: WordCoreJsNode,
  /** 是更新信息而非创建? */
  update?: boolean,
  /** 创建人 */
  creator?: string,
  /** 最后更新人 */
  updator?: string,
  /** 标题 */
  title?: string,
  /** 主题 */
  /** 修订号 */
  subject?: string,
  revision?: number | string
}

/** 生成docx解压后的docProps/core.xml文件对应的js对象 */
export const getWordCoreXmlJs = (params: WordCoreXmlJsGenerateParams) => {
  const {
    update,
    creator,
    updator,
    title,
    subject,
    revision,
    coreJs: inputCoreJs,
  } = params || {};
  const coreJs = inputCoreJs || {
    declaration: {
      attributes: { version: '1.0', encoding: 'UTF-8', standalone: 'yes' },
    },
    elements: [
      {
        type: 'element',
        name: 'cp:coreProperties',
        attributes: { 'xmlns:cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties', 'xmlns:dc': 'http://purl.org/dc/elements/1.1/', 'xmlns:dcterms': 'http://purl.org/dc/terms/', 'xmlns:dcmitype': 'http://purl.org/dc/dcmitype/', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
        elements: [
          { // 0 - 标题
            type: 'element', name: 'dc:title',
            elements: [{ type: 'text', text: ' ' }],
          },
          { // 1 - 主题
            type: 'element', name: 'dc:subject',
            elements: [{ type: 'text', text: ' ' }],
          },
          { // 2 - 作者
            type: 'element', name: 'dc:creator',
            elements: [{ type: 'text', text: '柳涤尘' }],
          },
          { // 3 - 关键字
            type: 'element', name: 'cp:keywords', elements: [],
          },
          { // 4 - 最后修改人
            type: 'element', name: 'cp:lastModifiedBy',
            elements: [{ type: 'text', text: '柳涤尘' }],
          },
          { // 5 - 修订号
            type: 'element', name: 'cp:revision',
            elements: [{ type: 'text', text: '1' }],
          },
          { // 6 - 创建时间
            type: 'element', name: 'dcterms:created',
            attributes: { 'xsi:type': 'dcterms:W3CDTF' },
            elements: [{ type: 'text', text: '2022-11-04T06:49:00Z' }],
          },
          { // 7 - 最后修改时间
            type: 'element', name: 'dcterms:modified',
            attributes: { 'xsi:type': 'dcterms:W3CDTF' },
            elements: [{ type: 'text', text: '2022-11-04T09:11:00Z' }],
          },
        ],
      },
    ],
  };
  if (title) {
    const index = coreJs.elements[0].elements.findIndex((ele: XmlNode) => ele.name === 'dc:title');
    if (index !== -1) {
      coreJs.elements[0].elements[index].elements = [{ type: 'text', text: `${title}` }];
    } else {
      coreJs.elements[0].elements.push({ type: 'element', name: 'dc:title', elements: [{ type: 'text', text: `${title}` }],
      });
    }
  }
  if (subject) {
    const index = coreJs.elements[0].elements.findIndex((ele: XmlNode) => ele.name === 'dc:subject');
    if (index !== -1) {
      coreJs.elements[0].elements[index].elements = [{ type: 'text', text: `${subject}` }];
    } else {
      coreJs.elements[0].elements.push({ type: 'element', name: 'subject', elements: [{ type: 'text', text: `${subject}` }],
      });
    }
  }
  if (creator || updator) {
    if (!update) {
      const index = coreJs.elements[0].elements.findIndex((ele: XmlNode) => ele.name === 'dc:creator');
      if (index !== -1) {
        coreJs.elements[0].elements[index].elements = [{ type: 'text', text: `${creator ?? '柳涤尘'}` }];
      } else {
        coreJs.elements[0].elements.push({ type: 'element', name: 'dc:creator', elements: [{ type: 'text', text: `${creator}` }],
        });
      }
    }
    const index = coreJs.elements[0].elements.findIndex((ele: XmlNode) => ele.name === 'cp:lastModifiedBy');
    if (index !== -1) {
      coreJs.elements[0].elements[index].elements = [{ type: 'text', text: `${updator ?? creator}` }];
    } else {
      coreJs.elements[0].elements.push({ type: 'element', name: 'cp:lastModifiedBy', elements: [{ type: 'text', text: `${updator ?? creator}` }],
      });
    }
  }
  if (revision) {
    const index = coreJs.elements[0].elements.findIndex((ele: XmlNode) => ele.name === 'cp:revision');
    if (index !== -1) {
      coreJs.elements[0].elements[index].elements = [{ type: 'text', text: `${revision}` }];
    } else {
      coreJs.elements[0].elements.push({ type: 'element', name: 'cp:revision', elements: [{ type: 'text', text: `${revision}` }],
      });
    }
  }
  const date = (new Date()).toISOString();
  const index = coreJs.elements[0].elements.findIndex((ele: XmlNode) => ele.name === 'dcterms:modified');
  if (index !== -1) {
    coreJs.elements[0].elements[index].elements = [{ type: 'text', text: date }];
  } else {
    coreJs.elements[0].elements.push({ type: 'element', name: 'dcterms:modified', elements: [{ type: 'text', text: date }],
    });
  }
  if (!update) {
    const index = coreJs.elements[0].elements.findIndex((ele: XmlNode) => ele.name === 'dcterms:created');
    if (index !== -1) {
      coreJs.elements[0].elements[index].elements = [{ type: 'text', text: date }];
    } else {
      coreJs.elements[0].elements.push({ type: 'element', name: 'dcterms:created', elements: [{ type: 'text', text: date }],
      });
    }
  }
  return coreJs;
};
