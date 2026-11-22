import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    'docs/',
    '**/*.min.js',
    'supabaseClient.js'
  ]),
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'import/extensions': ['error', 'ignorePackages'],
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
      'import/no-unresolved': [
        'error',
        { ignore: ['^https?://', '\\.css$', '^eslint/config$'] },
      ],
    },
  },
  {
    files: ['server/**/*.{js,mjs}', '*.config.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.test.{js,mjs}', '**/__tests__/**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  prettier,
]);