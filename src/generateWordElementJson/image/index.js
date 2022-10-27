/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 13:53:32
 * @LastEditTime: 2022-10-27 14:53:48
 */
const xmlns = {
  main2006: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  main2010: 'http://schemas.microsoft.com/office/drawing/2010/main',
  pic2006: 'http://schemas.openxmlformats.org/drawingml/2006/picture',
};

export const ensureCxCy = (cx, cy, maxCx, maxCy) => {
  if (maxCx) {
    if (!maxCy) maxCy = maxCx;
  } else if (maxCy) {
    maxCx = maxCy;
  }
  if (!cx || !cy || !maxCx || !maxCy || (cx <= maxCx && cy <= maxCy)) return { cx, cy };
  const rate = Math.min(maxCx / cx, maxCy / cy);
  return {
    cx: Math.round(cx * rate),
    cy: Math.round(cy * rate),
  };
};

// 为了简化和保证一定的兼容性，所有图片均被处理为内联样式
export const getImageXmlElementObj = (params) => {
  const {
    rId,
    name,
    cx,
    cy,
  } = params || {};
  const w_drawing = {
    type: 'element', name: 'w:drawing',
    elements: [
      {
        type: 'element', name: 'wp:inline',
        attributes: { distT: '0', distB: '0', distL: '0', distR: '0' },
        elements: [
          { type: 'element', name: 'wp:extent',
            attributes: { cx: `${cx}`, cy: `${cy}` }, elements: [],
          },
          { type: 'element', name: 'wp:effectExtent',
            attributes: { l: '0', t: '0', r: '0', b: '0' }, elements: [],
          },
          { type: 'element', name: 'wp:docPr',
            attributes: { id: `${rId}`, name: name || `图片 ${rId}` }, elements: [],
          },
          { type: 'element', name: 'wp:cNvGraphicFramePr',
            elements: [
              { type: 'element', name: 'a:graphicFrameLocks',
                attributes: { 'xmlns:a': xmlns.main2006, noChangeAspect: '1',
                }, elements: [],
              },
            ],
          },
          { type: 'element', name: 'a:graphic',
            attributes: { 'xmlns:a': xmlns.main2006 },
            elements: [
              { type: 'element', name: 'a:graphicData',
                attributes: { uri: xmlns.pic2006 },
                elements: [
                  { type: 'element', name: 'pic:pic',
                    attributes: { 'xmlns:pic': xmlns.pic2006 },
                    elements: [
                      { type: 'element', name: 'pic:nvPicPr',
                        elements: [
                          { type: 'element', name: 'pic:cNvPr',
                            attributes: { id: `${rId}`, name: name || `Picture ${rId}` }, elements: [],
                          },
                          { type: 'element', name: 'pic:cNvPicPr',
                            elements: [],
                          },
                        ],
                      },
                      { type: 'element', name: 'pic:blipFill',
                        elements: [
                          { type: 'element', name: 'a:blip',
                            attributes: { 'r:embed': `rId${rId}`, cstate: 'print' },
                            elements: [
                              { type: 'element', name: 'a:extLst',
                                elements: [
                                  { type: 'element', name: 'a:ext',
                                    attributes: { uri: '{28A0092B-C50C-407E-A947-70E740481C1C}' },
                                    elements: [
                                      {
                                        type: 'element',
                                        name: 'a14:useLocalDpi',
                                        attributes: { 'xmlns:a14': xmlns.main2010, val: '0',
                                        },
                                        elements: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          { type: 'element', name: 'a:srcRect',
                            elements: [],
                          },
                          { type: 'element', name: 'a:stretch',
                            elements: [
                              { type: 'element', name: 'a:fillRect',
                                elements: [],
                              },
                            ],
                          },
                        ],
                      },
                      { type: 'element', name: 'pic:spPr',
                        elements: [
                          { type: 'element', name: 'a:xfrm',
                            elements: [
                              { type: 'element', name: 'a:off',
                                attributes: { x: '0', y: '0' }, elements: [],
                              },
                              { type: 'element', name: 'a:ext',
                                attributes: { cx: `${cx}`, cy: `${cy}` }, elements: [],
                              },
                            ],
                          },
                          {
                            type: 'element', name: 'a:prstGeom',
                            attributes: { prst: 'rect' },
                            elements: [
                              { type: 'element', name: 'a:avLst',
                                elements: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const w_r = {
    type: 'element',
    name: 'w:r',
    elements: [
      { type: 'element', name: 'w:noProof', elements: [] },
      w_drawing,
    ],
  };
  return w_r;
};
