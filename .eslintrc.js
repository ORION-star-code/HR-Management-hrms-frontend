module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser', // 确保使用 vue-eslint-parser
  parserOptions: {
    parser: '@babel/eslint-parser', // 使用 @babel/eslint-parser 解析现代 JavaScript
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:vue/vue3-essential', // 适配 Vue 3
    'eslint:recommended',
  ],
  rules: {
    'vue/multi-word-component-names': 'off', // 可选，关闭多单词组件名限制
  },
};
