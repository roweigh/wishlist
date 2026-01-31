// eslint.config.js
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
 {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // 🔹 Base JS Rules
      'no-unused-vars': 'warn',
      '@stylistic/indent': ['warn', 2],
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/semi': 'warn',
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/space-in-parens': ['warn', 'never'],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/array-bracket-spacing': ['warn', 'never'],
      '@stylistic/quote-props': 0,
      '@stylistic/semi-style': ['error', 'last'],

      // 🔹 Vue-Specific Rules
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'ignore',
        multiline: 'below',
      }],
      'vue/multi-word-component-names': 0,
    },
  },
];