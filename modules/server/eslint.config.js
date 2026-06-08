// @ts-check
import rootConfig from '../../eslint.config.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(...rootConfig, {
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
  },
  rules: {
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { arguments: false } }],
  },
});
