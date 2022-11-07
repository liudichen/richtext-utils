# richtext-utils

[![NPM version](https://img.shields.io/npm/v/@iimm/richtext-utils.svg?style=flat)](https://npmjs.org/package/@iimm/richtext-utils)
[![NPM downloads](http://img.shields.io/npm/dm/@iimm/richtext-utils.svg?style=flat)](https://npmjs.org/package/@iimm/richtext-utils)

## Install

```bash
npm install @iimm/richtext-utils
```

<!-- ## 包含的内容

### 数据处理

#### 属性名称处理工具
1. pascalCase: (key: string) => string 将下划线名称转化为大驼峰式命名
2. camelCase: (key: string) => string 将下划线名称转化为小驼峰命名
3. separatorCase: (key: string) => string 将驼峰式命名转化为下划线命名

### html与json格式转化工具
1. jsonToHtml: (json: jsonItem | jsonItem[]) => string
2. htmlToJson: (html: string, options?: htmlToJsonOptions) => jsonItem[]; -->

## 注意

1. 处理过程中，所有图片均会被处理为内联样式，但是可能会包裹到段落里，因此实际可能不会跟其他文字或图片处于同一行。
2. 由于粘贴到ckEditor后丢失了很多信息，导致无法恢复有序/无序列表状态，因此在转回Word时会直接将有序/无序列表处理为纯粹的段落，根据列表层级产生默认的缩进。
3. 含img标签的元素转回word时由于需要其他处理

## LICENSE

MIT
