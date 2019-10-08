export default {
  input: 'src/index.js',
  external: ['d3-fetch'],
  output:{
    format: 'umd',
    name:'d3',
    file: 'build/erddap-parser.js',
    moduleId:'erddap-parser',
    extend:true,
    globals:{
      'd3-fetch':'d3'
    }
  }
}
