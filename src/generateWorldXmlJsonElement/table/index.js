/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-27 16:25:39
 * @LastEditTime: 2022-10-28 14:44:31
 */


// 待处理，行高等属性，合并单元格的验证

`
    <w:tblPr>
        <w:tblStyle w:val="a3"/>
        <w:tblW w:w="0" w:type="auto"/>
        <w:jc w:val="center"/>
        <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="1382"/>
        <w:gridCol w:w="1382"/>
        <w:gridCol w:w="1383"/>
        <w:gridCol w:w="1383"/>
        <w:gridCol w:w="1383"/>
      </w:tblGrid>
`;

// tblGrid可以不传，或不用传w:w，只要每个单元格有宽度就没问题
// w:tcW 如果不传w:w，则会自适应
`<w:tcPr>
            <w:tcW w:w="573" w:type="dxa"/>
            <w:tcBorders>
              <w:top w:val="single" w:sz="12" w:space="0" w:color="auto"/>
              <w:left w:val="single" w:sz="12" w:space="0" w:color="auto"/>
              <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto"/>
              <w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>
            </w:tcBorders>
            <w:vAlign w:val="center"/>
          </w:tcPr>`;
