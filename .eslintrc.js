/*
 * @Description:
 * @Author: 柳涤尘 https://www.iimm.ink
 * @LastEditors: 柳涤尘 liudichen@foxmail.com
 * @Date: 2022-04-15 08:59:51
 * @LastEditTime: 2022-10-24 16:31:49
 */
module.exports = {
  extends: 'eslint-config-egg',
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
  },
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
  },
  overrides: [
    {
      files: [ '*.ts' ],
      extends: [
        'eslint-config-egg/typescript',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint/eslint-plugin',
        'eslint-plugin-tsdoc',
      ],
    },
  ],
  rules: {
    'generator-star-spacing': 'off',
    'babel/generator-star-spacing': 'off',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '(^_)|(^props$)|(^e$)',
      },
    ],
    'arrow-parens': [ 'warn', 'always' ],
    'no-empty': [ 'error', { allowEmptyCatch: true }],
    'prefer-promise-reject-errors': 'off',
  },
};
