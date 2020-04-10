import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
//  external: ['d3-fetch'],
  plugins: [
    resolve(),
    commonJS({
      include: 'node_modules/**'
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  output:{
    format: 'umd',
    name:'d3',
    file: 'build/erddap-parser.js',
    moduleId:'erddap-parser',
    extend:true
  }
}
