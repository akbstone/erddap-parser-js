import {csv,json} from 'd3-fetch';

export default {

		_validateResponse:function(r){
			return r === 'csv' || r === 'json';
		},

		_validateRequest:function(r){
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
			let url_path = this.createErddapURLPath(ob),
				query_format = 'string',
				query_string = this.createErddapQueryString({...ob,query_format});
			
			return url_path + '?' + query_string;
		},


		/**
		 * Generate an ERDDAP QUERY string from the given constraints
		 * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
		 * @param {array} ob.constraints - the values (e.g., min max) the constrain the request
		 * @param {array} ob.variables - the variables requested
		 * @param {string} ob.query_format - string(default)|object
		 */
		createErddapQueryString: function(ob){
			let constraints = ob.constraints || {},
				variables = ob.variables || [],
				constraint_filters = [],
			
			constraint_keys = Object.keys(constraints || [])
			constraint_keys.forEach(k=>{
				constraint_filters.push(
					(k.replace('>','%3E').replace('<','%3C')) + ((k.match(/=|>|</) ? '' : '=') +
					(constraints[k] instanceof Date ? constraints[k].toISOString() : constraints[k])));
			})

			return ob.query_format === 'object' ? 
			{
				variables:variables,
				constraint_filters:constraint_filters
			} : [
					(variables ? variables.join('%2C') : null),
					(constraint_filters ? constraint_filters.join('&') : null)
				].filter(d=>d).join('&');
			
		},

			
		/**
		 * Generate an ERDDAP URL path from the given constraints
		 * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
		 * @param {string} ob.protocol - the ERDDAP protocol: griddap or tabledap
		 * @param {string} ob.request - the type of request: data or metadata (or info)
		 * @param {string} ob.dataset_id - the dataset identifier (the part after the server and protocol)
		 * @param {string} ob.response - the type of response requested (default: csv)
		 */
		createErddapURLPath: function(ob){
			if(!ob.server){
				throw(new Error('Must define server'))
			}
			let erddap_srv = ob.server,
				protocol = ob.protocol,
				request = ob.request === 'metadata' ? 'info' : ob.request || 'data', //default to data
				dataset_id = ob.dataset_id,
				response = ob.response || 'csv',
				path = (request === 'info' || request == 'search') ? 'index' : '';


			if(!this._validateRequest(request)){
				throw(new Error('Invalid request type (' + request + ')'))
			}

			if(!this._validateResponse(response)){
				throw new Error('Invalid response type (' + response + ')')
			}

			if(request !== 'search' && !dataset_id){
				throw(new Error('Must define dataset_id for info and data requests'));
			}

			return erddap_srv +
				(protocol ? ('/' + protocol) : '') +
				(request === 'data' ? '' : '/' + request) +
				(dataset_id ? ('/' + dataset_id) : '') +
				(path ? ('/' + path) : '') +
				'.' + response;
		},

		/**
		 * Make an ERDDAP request using given constraints and parameters
		 * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
		 */

		getErddapData:async function(ob){

			let url = this.createErddapUrl(ob),
				response = ob.response || 'csv',
				parseType = response.match(/csv/) ? 'csv' : (response.match(/json/) ? 'json' : 'text'),
				fns = {
					json:json,
					csv:csv
				},
				fn = fns[parseType];
				

			return new Promise((resolve,reject)=>{
				fn(url)
					.then(response=> {
						resolve(response);
					})
					.catch(e=>{
						console.log('Error')
						console.log(e)
						//throw new Error('unable to fetch')
						reject(e);
					})
					
				
					
			})
		},

		getTabledapData:async function(ob)
		{

			ob.request = 'data';
			ob.protocol = 'tabledap';
			ob.response = 'csv';
			let data = await this.getErddapData(ob)

			return this.parseTabledapData(data,ob);
		},


		getDatasetMetadataOb: function(ob){
			return {...ob,...{
				request:'info',
				response:'csv'
			}}
		},


		getDatasetMetadata: async function(ob){
			ob = this.getDatasetMetadataOb(ob);

			let metadataCsv = await this.getErddapData(ob)
			return this.parseDatasetMetadata(metadataCsv)
		},

		getSearchTableDapOb: function(ob){
			return {...ob,...{
				constraints:{
					...{'itemsPerPage':20, 'page': 1},
					...ob.constraints
				},
				request:'search',
				response:'csv'
			}}
		},

		searchTabledap: async function(ob){

			ob = this.getSearchTableDapOb(ob);

			if ( !ob.constraints.searchFor) {
				return this.parseTabledapSearchSesults([]);
			}

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
		parseTabledapSearchSesults:function(searchCsv){
			return searchCsv;
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
