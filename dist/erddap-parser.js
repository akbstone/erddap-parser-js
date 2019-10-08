(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

  var EOL = {},
      EOF = {},
      QUOTE = 34,
      NEWLINE = 10,
      RETURN = 13;

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "]";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function pad(value, width) {
    var s = value + "", length = s.length;
    return length < width ? new Array(width - length + 1).join(0) + s : s;
  }

  function formatYear(year) {
    return year < 0 ? "-" + pad(-year, 6)
      : year > 9999 ? "+" + pad(year, 6)
      : pad(year, 4);
  }

  function formatDate(date) {
    var hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds(),
        milliseconds = date.getUTCMilliseconds();
    return isNaN(date) ? "Invalid Date"
        : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
        + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
        : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
        : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
        : "");
  }

  function dsv(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
        DELIMITER = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns || [];
      return rows;
    }

    function parseRows(text, f) {
      var rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // current line number
          t, // current token
          eof = N <= 0, // current token followed by EOF?
          eol = false; // current token followed by EOL?

      // Strip the trailing newline.
      if (text.charCodeAt(N - 1) === NEWLINE) --N;
      if (text.charCodeAt(N - 1) === RETURN) --N;

      function token() {
        if (eof) return EOF;
        if (eol) return eol = false, EOL;

        // Unescape quotes.
        var i, j = I, c;
        if (text.charCodeAt(j) === QUOTE) {
          while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
          if ((i = I) >= N) eof = true;
          else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          return text.slice(j + 1, i - 1).replace(/""/g, "\"");
        }

        // Find next delimiter or newline.
        while (I < N) {
          if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          else if (c !== DELIMITER) continue;
          return text.slice(j, i);
        }

        // Return last token before EOF.
        return eof = true, text.slice(j, N);
      }

      while ((t = token()) !== EOF) {
        var row = [];
        while (t !== EOL && t !== EOF) row.push(t), t = token();
        if (f && (row = f(row, n++)) == null) continue;
        rows.push(row);
      }

      return rows;
    }

    function preformatBody(rows, columns) {
      return rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      });
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
    }

    function formatBody(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return preformatBody(rows, columns).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(value) {
      return value == null ? ""
          : value instanceof Date ? formatDate(value)
          : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
          : value;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatBody: formatBody,
      formatRows: formatRows
    };
  }

  var csv = dsv(",");

  var csvParse = csv.parse;
  var csvParseRows = csv.parseRows;
  var csvFormat = csv.format;
  var csvFormatBody = csv.formatBody;
  var csvFormatRows = csv.formatRows;

  var tsv = dsv("\t");

  var tsvParse = tsv.parse;
  var tsvParseRows = tsv.parseRows;
  var tsvFormat = tsv.format;
  var tsvFormatBody = tsv.formatBody;
  var tsvFormatRows = tsv.formatRows;

  function responseText(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.text();
  }

  function text(input, init) {
    return fetch(input, init).then(responseText);
  }

  function dsvParse(parse) {
    return function(input, init, row) {
      if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
      return text(input, init).then(function(response) {
        return parse(response, row);
      });
    };
  }

  var csv$1 = dsvParse(csvParse);

  function responseJson(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.json();
  }

  function json(input, init) {
    return fetch(input, init).then(responseJson);
  }

  var erddapParser = {
  			
  		validateResponse:function(r){
  			return r === 'csv' || r === 'json';
  		},

  		validateRequest:function(r){
  			return r === 'data' || r === 'info' || r === 'search';
  		},
  	
  		createErddapUrl:function(ob){
  			ob = ob || {};
  			if(!ob.server){
  				throw(new Error('Must define server'))
  			}
  			let server = ob.server,
  				protocol = ob.protocol,
  				request = ob.request === 'metadata' ? 'info' : ob.request || 'data', //default to data
  				dataset_id = ob.dataset_id,
  				constraints = ob.constraints || {},
  				variables = ob.variables || [],
  				response = ob.response || 'csv',
  				path = (request === 'info' || request == 'search') ? 'index' : '';
  			
  			
  			if(!this.validateRequest(request)){
  				throw(new Error('Invalid request type (' + request + ')'))
  			}

  			if(!this.validateResponse(response)){
  				throw new Error('Invalid response type (' + response + ')')
  			}
  			
  			if(request !== 'search' && !dataset_id){
  				throw(new Error('Must define dataset_id for info and data requests'));
  			}

  			let constraint_filters = [],
  				constraint_keys = Object.keys(constraints || {});
  			constraint_keys.forEach(k=>{
  				constraint_filters.push(
  					(k.replace('>','%3E').replace('<','%3C')) + ((k.match(/=|>|</) ? '' : '=') + 
  					(constraints[k] instanceof Date ? constraints[k].toISOString() : constraints[k])));
  			});
  			
  			return server + 
  				(protocol ? ('/' + protocol) : '') + 
  				(request === 'data' ? '' : '/' + request) + 
  				(dataset_id ? ('/' + dataset_id) : '') + 
  				(path ? ('/' + path) : '') + 
  				'.' + response + '?' +
  				[
  					(variables ? variables.join('%2C') : null),
  					(constraint_filters ? constraint_filters.join('&') : null)
  				].filter(d=>d).join('&');


  		},


  		getErddapData:async function(ob){
  			let url = this.createErddapUrl(ob),
  				response = ob.response || 'csv',
  				parseType = response.match(/csv/) ? 'csv' : (response.match(/json/) ? 'json' : 'text'),
  				fns = {
  					csv:csv$1,
  					json:json
  				},
  				fn = fns[parseType], 
  				res = await fn(url);

  			return res;
  		},

  		getTabledapData:async function(ob)
  		{

  			ob.request = 'data';
  			ob.protocol = 'tabledap';
  			ob.response = 'csv';
  			let data = await this.getErddapData(ob);

  			return this.parseTabledapData(data,ob);
  		},


  		getDatasetMetadata: async function(ob){
  			ob.request = 'info';
  			ob.response = 'csv';

  			let metadataCsv = await this.getErddapData(ob);
  			return this.parseDatasetMetadata(metadataCsv)
  		},

  		searchTabledap: async function(query){
  			let searchCsv = csv$1('http://erddap.sensors.axds.co/erddap/search/index.html?page=1&itemsPerPage=20&searchFor=' + query);
  			return this.parseTabledapSearchSesults(searchCsv)
  		},

  		parseTabledapData:function(dataCsv = [],ob = {}){

  			let variable_names = ob.variable_names || {},
  				variables = (
  					ob.variables || 
  					Object.keys((dataCsv && dataCsv.length) ? dataCsv[0] : {})
  				).map(v=>{
  					return {
  						key:variable_names[v] || v,
  						value:v 
  					}
  				});
  			
  			dataCsv.shift();
  			dataCsv = dataCsv.slice().map(function(d){ 
  				let o = {};
  				variables.forEach(v=>{
  					o[v.key] = v.key.match(/time|date/) ? new Date(d[v.value]) : +d[v.value]; 
  				});
  				return o;	
  			});

  			return dataCsv;
  		},
  		parseTabledapSearchSesults:function(searchCsv){
  			return searchCsv;
  		},
  		parseDatasetMetadata:function(metadataCsv){
  			return metadataCsv.filter(d=>d['Row Type'] == 'variable')
  				.filter(
  					d=>d['Variable Name'] !== 'latitude' && 
  					d['Variable Name'] !== 'longitude' && 
  					d['Variable Name'] !== 'z' && 
  					d['Variable Name'] !== 'station'
  				)
  				.map(function(d){
  					var attributes = metadataCsv.filter(r=>r['Variable Name'] == d['Variable Name'] && r['Row Type'] == 'attribute');
  					attributes.forEach(function(a){
  						d[a['Attribute Name']] = a['Value'];
  						d[a['Attribute Name'].toLowerCase().replace(/\s+/g,'_')] = a['Value'];
  					});
  				
  					return d;
  				})
  			
  		}
  	};

  exports.erddapParser = erddapParser;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
