const tape = require("tap").test,
	  erddapParser = require("../").erddapParser,
	  testMetadata = require('./test_metadata.json');


tape("parseDatasetMetadata() formats headers correctly", function(test){


	var metadata_csv = testMetadata,//mock metadata csv
		metadata = erddapParser.parseDatasetMetadata(metadata_csv),
		expected = {
			"Row Type": "variable",
			"Variable Name": "air_temperature",
			"Attribute Name": "",
			"Data Type": "double",
			"Value": "",
			"_FillValue": "-9999.99",
			"_fillvalue": "-9999.99",
			"id": "322100",
			"ioos_category": "Other",
			"long_name": "Air Temperature",
			"missing_value": "-9999.99",
			"platform": "station",
			"standard_name": "air_temperature",
			"units": "degree_Celsius",
			"urn": "http://mmisw.org/ont/cf/parameter/air_temperature"
		  };

	test.deepEqual(metadata[0], expected)
	test.equal(metadata[0]['Variable Name'],'air_temperature');
	test.equal(metadata[0]['long_name'],'Air Temperature');
	test.equal(metadata[0]['units'],'degree_Celsius');
	//test.deepEqual(metadata[0],)
	test.end();
})



tape("parseTabledapData() formats data correctly", function(test){


	var dataCsv = [


		],
		data = erddapParser.parseTabledapData(dataCsv)

	test.deepEqual(data,[])
	test.end();
})
