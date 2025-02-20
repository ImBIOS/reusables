import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import * as path from 'node:path';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	// Ignore files not tracked by VCS and any config files
	includeIgnoreFile(path.join(import.meta.dirname, './.gitignore')),
	{
		ignores: ['**/dist', '**/node_modules', '**/.astro', '**/.github', '**/.changeset'],
	},

	// Global config
	// JavaScript
	eslint.configs.recommended,
	// TypeScript
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		plugins: {
			import: importPlugin,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{ prefer: 'type-imports', fixStyle: 'separate-type-imports' },
			],
			'@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: { attributes: false } }],
			'@typescript-eslint/no-unnecessary-condition': [
				'error',
				{
					allowConstantLoopConditions: true,
				},
			],
			'@typescript-eslint/no-non-null-assertion': 'error',
			'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		},
	},
	{
		linterOptions: { reportUnusedDisableDirectives: true },
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	// Allow triple-slash references in `*.d.ts` files.
	{
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},

	// Astro
	...eslintPluginAstro.configs.recommended,

	// Set globals for Node scripts.
	{
		files: ['scripts/**'],
		languageOptions: {
			globals: globals.node,
		},
	}
) satisfies Linter.Config[];
