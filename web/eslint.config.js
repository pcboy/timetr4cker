import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelteParser from 'svelte-eslint-parser';
import eslintPluginReadableTailwind from 'eslint-plugin-readable-tailwind';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintParserTypeScript from '@typescript-eslint/parser';
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parser: eslintParserTypeScript,
      parserOptions: {
        project: true
      }
    }
  },
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: eslintParserTypeScript,
        //project: true,
        sourceType: 'module',
        ecmaVersion: 2023,
        extraFileExtensions: ['.svelte']
      }
    },
    plugins: {
      'readable-tailwind': eslintPluginReadableTailwind
    },
    rules: {
      ...eslintPluginReadableTailwind.configs.warning.rules,
      ...eslintPluginReadableTailwind.configs.error.rules,
      'readable-tailwind/multiline': ['warn', { printWidth: 80, group: 'newLine' }],
      'readable-tailwind/no-unnecessary-whitespace': 'off'
      //'readable-tailwind/sort-classes': 'warn'
    }
  },
  {
    ignores: ['.svelte-kit/*']
  }
);
