import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	dest: 'dist/preact-scroll-header.js',
	moduleName: 'ScrollHeader',
	external: ['preact'],
	format: 'umd',
	plugins: [
		buble({
			jsx: 'h',
			transforms: {
				modules: false
			}
		})
	]
}
