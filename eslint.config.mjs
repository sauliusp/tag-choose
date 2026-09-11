import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
export default [
  { ignores: ['node_modules/**', 'dist/**', 'website/**', 'marketing/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, chrome: 'readonly' },
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^React$' },
      ],
    },
  },
];
