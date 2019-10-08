import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  //external: ['d3-fetch'],
  plugins:[
    resolve()
  ],
  output:{
    format: 'umd',
    name:'d3',
    file: 'dist/erddap-parser.js',
    moduleId:'erddap-parser',
    extend:true,
    globals:{
      'd3-fetch':'d3'
    }
  }
}
