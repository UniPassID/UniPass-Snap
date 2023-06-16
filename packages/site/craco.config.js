const path = require('path')
const sassResourcesLoader = require('craco-sass-resources-loader')
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			return webpackConfig
		},
		alias: {
			/* alias config: "@" as src directory */
			'@': path.resolve(__dirname, 'src')
		},
		// plugins: {
		// 	add: [
		// 		new NodePolyfillPlugin({
		// 			excludeAliases: ['console']
		// 		})
		// 	]
		// }
	},
	plugins: [
		{
			/* add sassResourcesLoader for global variable in scss file */
			plugin: sassResourcesLoader,
			options: {
				resources: './src/assets/styles/index.scss'
			}
		}
	]
}
