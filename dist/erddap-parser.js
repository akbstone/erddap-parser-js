(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

	var erddapParser = {
			createErddapUrl(erddap_install,search_arguments){

			},

			getTabledapData(url){
				
			},

			getTabledapDatasetMetadata(dataset){
				let _this = this;
				return new Promise(function(resolve,reject){
					d3.csv('https://erddap.sensors.axds.co/erddap/info/' + dataset + '/index.csv').then(function(csv){
						resolve(_this.parseTabledapMetadata(csv));
					});
				})
			
			},

			searchTabledap(erddap_install,query){

			},

			parseTabledapData(csv,metadata){
				return 33;
			},
			parseTabledapSearchSesults(csv){
				return 44;
			},
			parseTabledapMetadata(csv){
				return csv.filter(d=>d['Row Type'] == 'variable')
					.filter(
						d=>d['Variable Name'] !== 'latitude' && 
						d['Variable Name'] !== 'longitude' && 
						d['Variable Name'] !== 'z' && 
						d['Variable Name'] !== 'station'
					)
					.map(function(d){
						var attributes = csv.filter(r=>r['Variable Name'] == d['Variable Name'] && r['Row Type'] == 'attribute');
						attributes.forEach(function(a){
						d[a['Attribute Name']] = a['Value'];
						});
					
						return d;
					})
				
			}
		};

	exports.erddapParser = erddapParser;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
