export default {
  input: 'src/index.js',
  external: ['d3-dsv'],
  output:{
    format: 'umd',
    name:'d3',
    file: 'dist/erddap-parser.js',
    moduleId:'erddap-parser',
    extend:true,
    globals:{
      'd3-dsv':'d3'
    }
  }
}
