// eslint.config.js
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends('plugin:react/recommended', 'plugin:react-hooks/recommended'),
  {
    ignores: [
      'dist/**', // Ignore build files
      'node_modules/**',
      '**/*.min.js',
      'coverage/**',
      'jest-setup.js', // Ignore test setup
      '**/__tests__/**' // Ignore test files
    ],
    plugins: {
      'jsx-a11y': jsxA11y,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',

      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // We're not using prop-types
      
      // Relax some rules for development
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'react/no-unescaped-entities': 'warn'
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
      },
    },
  },
];
