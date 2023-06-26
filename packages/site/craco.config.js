const path = require('path')
const sassResourcesLoader = require('craco-sass-resources-loader')

module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			return webpackConfig
		},
		alias: {
			/* alias config: "@" as src directory */
			'@': path.resolve(__dirname, 'src')
		}
	},
	plugins: [
		{
			/* add sassResourcesLoader for global variable in scss file */
			plugin: sassResourcesLoader,
			options: {
				resources: './src/assets/styles/index.scss'
			}
		}
	],
	babel: {
		plugins: process.env.NODE_ENV === 'production' ? [['transform-remove-console', { exclude: ['error'] }]] : []
	}
}
