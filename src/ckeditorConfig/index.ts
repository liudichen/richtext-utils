/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-10-26 20:38:14
 * @LastEditTime: 2022-11-07 20:49:40
 */
export const ConfigForWordRichText = {
  fontFamily: {
    options: [ '宋体', '黑体', '仿宋', '微软雅黑', 'default', 'Arial', 'Times New Roman' ],
    supportAllValues: true,
  },
  fontSize: {
    options: [
      { title: '小四', model: '12pt' },
      { title: '四号', model: '14pt' },
      { title: '小三', model: '15pt' },
      { title: '三号', model: '16pt' },
      { title: '小二', model: '18pt' },
      { title: '二号', model: '22pt' },
      { title: '小五', model: '9pt' },
      { title: '五号', model: '10.5pt' },
      { title: '小六', model: '6.5pt' },
      { title: '六号', model: '7.5pt' },
      { title: '小一', model: '24pt' },
      { title: '一号', model: '26pt' },
      { title: '小初', model: '36pt' },
      { title: '初号', model: '42pt' },
    ],
    supportAllValues: true,
  },
  indent: {
    supportAllValues: true,
  },
  htmlSupport: {
    allow: [
      {
        name: /^(p|span|img|table|tbody|thead|tfoot|tr|td|th|col|colgroup|b|strong|s|sub|sup|u|i|em|h[1-6]|figure)$/,
        attributes: { width: true, height: true },
        // attributes: true,
        classes: false,
        styles: true,
      },
    ],
  },
};

