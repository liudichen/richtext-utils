import type { HtmlXmlParamsImageNode, XmlElementGenerationConfig, XmlNode } from "@/types/index";

const xmlns = {
  main2006: "http://schemas.openxmlformats.org/drawingml/2006/main",
  main2010: "http://schemas.microsoft.com/office/drawing/2010/main",
  pic2006: "http://schemas.openxmlformats.org/drawingml/2006/picture",
};

/**将解析后的图片节点对象数据转换成xml格式对应的json(有外层 w:r 包裹)
 * ```
 * 需要用的node参数有 rId, name, cx, cy
 * 会用到的config参数有 imageMaxC, imageMaxCx, imageMaxCy
 * ```
 */
export const imageXmlParamsNodeToXmlElementObj = (
  imageNode: HtmlXmlParamsImageNode,
  config: XmlElementGenerationConfig = {}
) => {
  let { rId, name, cx, cy } = imageNode;
  if (!cx || !cy || !rId) return;
  const { imageMaxC, imageMaxCx, imageMaxCy } = config || {};
  const mCx = imageMaxCx || imageMaxC;
  const mCy = imageMaxCy || imageMaxC;

  if (mCx && mCy && (cx > mCx || cy > mCy)) {
    const rate = Math.min(mCx / cx, mCy / cy);
    cx = Math.round(cx * rate);
    cy = Math.round(cy * rate);
  }

  if (!name) name = `Picture ${rId}`;
  const w_drawing = {
    type: "element",
    name: "w:drawing",
    elements: [
      {
        type: "element",
        name: "wp:inline",
        attributes: { distT: "0", distB: "0", distL: "0", distR: "0" },
        elements: [
          { type: "element", name: "wp:extent", attributes: { cx: `${cx}`, cy: `${cy}` }, elements: [] },
          { type: "element", name: "wp:effectExtent", attributes: { l: "0", t: "0", r: "0", b: "0" }, elements: [] },
          {
            type: "element",
            name: "wp:docPr",
            attributes: { id: `${rId}`, name: name || `图片 ${rId}` },
            elements: [],
          },
          {
            type: "element",
            name: "wp:cNvGraphicFramePr",
            elements: [
              {
                type: "element",
                name: "a:graphicFrameLocks",
                attributes: { "xmlns:a": xmlns.main2006, noChangeAspect: "1" },
                elements: [],
              },
            ],
          },
          {
            type: "element",
            name: "a:graphic",
            attributes: { "xmlns:a": xmlns.main2006 },
            elements: [
              {
                type: "element",
                name: "a:graphicData",
                attributes: { uri: xmlns.pic2006 },
                elements: [
                  {
                    type: "element",
                    name: "pic:pic",
                    attributes: { "xmlns:pic": xmlns.pic2006 },
                    elements: [
                      {
                        type: "element",
                        name: "pic:nvPicPr",
                        elements: [
                          {
                            type: "element",
                            name: "pic:cNvPr",
                            attributes: { id: `${rId}`, name: `${name}` },
                            elements: [],
                          },
                          { type: "element", name: "pic:cNvPicPr", elements: [] },
                        ],
                      },
                      {
                        type: "element",
                        name: "pic:blipFill",
                        elements: [
                          {
                            type: "element",
                            name: "a:blip",
                            attributes: { "r:embed": `rId${rId}`, cstate: "print" },
                            elements: [
                              {
                                type: "element",
                                name: "a:extLst",
                                elements: [
                                  {
                                    type: "element",
                                    name: "a:ext",
                                    attributes: { uri: "{28A0092B-C50C-407E-A947-70E740481C1C}" },
                                    elements: [
                                      {
                                        type: "element",
                                        name: "a14:useLocalDpi",
                                        attributes: { "xmlns:a14": xmlns.main2010, val: "0" },
                                        elements: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          { type: "element", name: "a:srcRect", elements: [] },
                          {
                            type: "element",
                            name: "a:stretch",
                            elements: [{ type: "element", name: "a:fillRect", elements: [] }],
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "pic:spPr",
                        elements: [
                          {
                            type: "element",
                            name: "a:xfrm",
                            elements: [
                              { type: "element", name: "a:off", attributes: { x: "0", y: "0" }, elements: [] },
                              {
                                type: "element",
                                name: "a:ext",
                                attributes: { cx: `${cx}`, cy: `${cy}` },
                                elements: [],
                              },
                            ],
                          },
                          {
                            type: "element",
                            name: "a:prstGeom",
                            attributes: { prst: "rect" },
                            elements: [{ type: "element", name: "a:avLst", elements: [] }],
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
    type: "element",
    name: "w:r",
    elements: [{ type: "element", name: "w:noProof", elements: [] }, w_drawing],
  };
  return w_r as XmlNode;
};
