# richtext-utils

[![NPM version](https://img.shields.io/npm/v/@iimm/richtext-utils.svg?style=flat)](https://npmjs.org/package/@iimm/richtext-utils)
[![NPM downloads](http://img.shields.io/npm/dm/@iimm/richtext-utils.svg?style=flat)](https://npmjs.org/package/@iimm/richtext-utils)

## Install

```bash
$ npm install @iimm/richtext-utils
```

## 包含的内容

### 数据处理

#### 属性名称处理工具
1. pascalCase: (key: string) => string 将下划线名称转化为大驼峰式命名
2. camelCase: (key: string) => string 将下划线名称转化为小驼峰命名
3. underlineCase: (key: string) => string 将驼峰式命名转化为下划线命名

### html与json格式转化工具
1. jsonToHtml: (json: jsonItem | jsonItem[]) => string
2. htmlToJson: (html: string, options?: htmlToJsonOptions) => jsonItem[];

<details>
<summary>json数组元素的类型</summary>
<code>
interface textJsonItem {
  type: 'text',
  value: string,
}

interface commentJsonItem {
  type:'comment',
  value: string,
}

interface otherJsonItem {
  type: 'tag',
  tagName: string,
  classList?: string[],
  attrs?: object,
  inlineStyle?: string,
  style?: object,
  children: (otherJsonItem | textJsonItem | commentJsonItem)[]
}

type jsonItem = textJsonItem | commentJsonItem | otherJsonItem;
</code>
</details>

## Options

TODO

## LICENSE

MIT
