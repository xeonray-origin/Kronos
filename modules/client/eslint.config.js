// @ts-check
import rootConfig from '../../eslint.config.js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(...rootConfig, {
  files: ['**/*.tsx', '**/*.ts'],
  plugins: { react: reactPlugin, 'react-hooks': reactHooksPlugin },
  languageOptions: {
    parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
  },
  settings: { react: { version: 'detect' } },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
});
