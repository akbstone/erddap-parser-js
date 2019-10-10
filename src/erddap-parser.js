import {csv,json} from 'd3-fetch';

export default {

		validateResponse:function(r){
			return r === 'csv' || r === 'json';
		},

		validateRequest:function(r){
			return r === 'data' || r === 'info' || r === 'search';
		},
	
		/**
		 * Generate an ERDDAP URL from the given constraints
		 * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
		 * @param {string} ob.server - the base URL of the ERDDAP server
		 * @param {string} ob.protocol - the ERDDAP protocol: griddap or tabledap
		 * @param {string} ob.request - the type of request: data or metadata (or info)
		 * @param {string} ob.dataset_id - the dataset identifier (the part after the server and protocol)
		 * @param {array} ob.constraints - the values (e.g., min max) the constrain the request
		 * @param {array} ob.variables - the variables requested
		 * @param {string} ob.response - the type of response requested (default: csv)
		 */
		createErddapUrl:function(ob){
			ob = ob || {};
			if(!ob.server){
				throw(new Error('Must define server'))
			}
			let erddap_srv = ob.server,
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
				constraint_keys = Object.keys(constraints || {})
			constraint_keys.forEach(k=>{
				constraint_filters.push(
					(k.replace('>','%3E').replace('<','%3C')) + ((k.match(/=|>|</) ? '' : '=') +
					(constraints[k] instanceof Date ? constraints[k].toISOString() : constraints[k])));
			})

			return erddap_srv +
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
					json:json,
					csv:csv
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
			let data = await this.getErddapData(ob)

			return this.parseTabledapData(data,ob);
		},


		getDatasetMetadata: async function(ob){
			ob.request = 'info';
			ob.response = 'csv';

			let metadataCsv = await this.getErddapData(ob)
			return this.parseDatasetMetadata(metadataCsv)
		},

		searchTabledap: async function(ob){

			ob.constraints = Object.assign({'itemsPerPage':20, 'page': 1}, ob.constraints);

			if ( !ob.constraints.searchFor) {
				return this.parseTabledapSearchSesults([]);
			}

			ob.request = 'search';
			ob.response = 'csv';

			let searchCsv = await this.getErddapData(ob)
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
				})
				return o;
			});

			return dataCsv;
		},
		/**
		 * Parse search csv data to ensure keys are lowercase and spaces
		 * converted to underscores.
		 * @param {Object} searchCsv - an object containing the input csv data
		 */
		parseTabledapSearchResults:function(searchCsv){

			return searchCsv.map(d =>{
				var result = {};
				for (const [key, value] of Object.entries(d)) {
					result[key.toLowerCase().replace(/\s+/g,"_")] = value;
				}
				return result;
			});
		},
		parseDatasetMetadata:function(metadataCsv){

			return metadataCsv.filter(d=>d['Row Type'] == 'variable')
				.filter(
					d=>d['Variable Name'] !== 'latitude' && 
					d['Variable Name'] !== 'longitude' && 
					d['Variable Name'] !== 'z' && 
					d['Variable Name'] !== 'station' && 
					!d['Variable Name'].match(/time/i)
				)
				.map(function(d){
					var attributes = metadataCsv.filter(r=>r['Variable Name'] == d['Variable Name'] && r['Row Type'] == 'attribute')
					attributes.forEach(function(a){
						d[a['Attribute Name']] = a['Value']
						d[a['Attribute Name'].toLowerCase().replace(/\s+/g,'_')] = a['Value'];
					})

					return d;
				})

		}
	}
