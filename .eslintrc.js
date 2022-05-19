module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'no-prototype-builtins': 'off',
    'no-template-curly-in-string': 'off',
    'vue/no-v-model-argument': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'max-len': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    indent: 'off',
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always',
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 1,
      },
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'below',
    }],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: {
        startTag: 0,
        endTag: 2,
        selfClosingTag: 0,
      },
      alignAttributesVertically: true,
      ignores: [],
    }],
    'vue/attribute-hyphenation': 0,
    'vue/require-prop-types': 0,
    'vue/require-default-prop': 0,
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
    'vue/no-v-html': 0,
  },
};
