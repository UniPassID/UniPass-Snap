module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['prettier'],
	extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier', 'react-app', 'react-app/jest'],
	env: {
		node: true,
		jest: true
	},
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'no-console': 'off',
		'no-debugger': 'warn',
		'import/no-unresolved': 'off',
		'prettier/prettier': 'error',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/ban-types': [
			'error',
			{
				extendDefaults: true,
				types: {
					'{}': false
				}
			}
		]
	}
}
