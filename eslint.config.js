import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		ignores: ['src/components/ui/**'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			globals: globals.browser,
		},
	},
	{
		files: ['**/*.{js,ts,tsx}'],
		plugins: { '@stylistic': stylistic },
		languageOptions: { parser: tseslint.parser },
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/jsx-indent-props': ['error', 'tab'],
			'@stylistic/no-mixed-spaces-and-tabs': 'error',
		},
	},
])
