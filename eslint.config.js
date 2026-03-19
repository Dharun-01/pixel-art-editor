import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';

export default [
	// 1. Tell ESLint what to IGNORE (This replaces .eslintignore)
	{
		ignores: ['dist/**', 'node_modules/**', 'bin/**', 'build/**'],
	},

	// 2. The Main Configuration
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		plugins: {
			react: pluginReact,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node, // This fixes the '__dirname' and 'process' errors
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: 'detect', // Automatically detects your React version
			},
		},
		rules: {
			...js.configs.recommended.rules,
			...pluginReact.configs.flat.recommended.rules,

			// Your Custom "Artisan" Rules
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'no-console': 'off',
			'no-undef': 'error',
			'no-constant-condition': 'warn',
			'no-empty': 'warn',
		},
	},
];
