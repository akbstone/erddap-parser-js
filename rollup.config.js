export default {
  input: 'index.js',
  external: ['d3-csv'],
  output:{
    format: 'umd',
    name:'d3',
    file: 'build/erddap-parser.js',
    moduleId:'erddap-parser',
    extend:true,
    globals:{
      'd3-csv':'d3'
    }
  }
}
