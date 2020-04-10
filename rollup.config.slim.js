import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  external: ['d3-fetch'],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  output:{
    format: 'umd',
    name:'d3',
    file: 'build/erddap-parser.slim.js',
    moduleId:'erddap-parser',
    extend:true,
    globals:{
      'd3-fetch':'d3'
    } 
  }
}
