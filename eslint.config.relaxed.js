import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescript,
    },
    rules: {
      // Only keep essential rules, disable most recommendations
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
      'react/jsx-no-undef': 'error', // Keep this for safety
      'react/jsx-key': 'error', // Keep this for React performance
      'react-hooks/rules-of-hooks': 'error', // Keep this for React Hooks
      'react-hooks/exhaustive-deps': 'off', // Disable exhaustive deps warning
      'react-refresh/only-export-components': 'off',
      
      // Disable most TypeScript strict rules
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      
      // Disable most general rules
      'no-console': 'off',
      'no-debugger': 'warn', // Only warn for debugger
      'no-unused-vars': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
      'object-shorthand': 'off',
      'prefer-template': 'off',
      'template-curly-spacing': 'off',
      'arrow-spacing': 'off',
      'no-duplicate-imports': 'off',
      'sort-imports': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
