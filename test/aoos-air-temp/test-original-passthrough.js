const tape = require("tap").test,
	  erddapParser = require("../../build/erddap-parser").erddapParser,
	  metadata_original_json = require("./metadata_original.json");
	  metadata_expected_v1 = require("./metadata_expected_v1.json")
	  metadata_expected_v2 = require("./metadata_expected_v2.json")


tape("parseDatasetMetadata_v1() formats headers correctly", function(test){

	var metadata_original = metadata_original_json, //mock metadata csv
		metadata = erddapParser.parseDatasetMetadata(metadata_original),
		expected = metadata_expected_v1
		
	test.deepEqual(metadata[0], expected)
	test.equal(metadata[0]['Variable Name'],'air_temperature');
	test.equal(metadata[0]['long_name'],'Air Temperature');
	test.equal(metadata[0]['units'],'degree_Celsius');
	test.end();
})


// tape("parseDatasetMetadata_v2() formats headers correctly", function(test){

// 	var metadata_original = metadata_original_json, //mock metadata csv
// 		metadata = erddapParser.parseDatasetMetadata(metadata_original),
// 		expected = metadata_expected_v2
		
// 	test.deepEqual(metadata[0], expected)
// 	// test.equal(metadata[0]['Variable Name'],'air_temperature');
// 	// test.equal(metadata[0]['long_name'],'Air Temperature');
// 	// test.equal(metadata[0]['units'],'degree_Celsius');
// 	test.end();
// })


tape("parseTabledapData() formats data correctly", function(test){

	var dataCsv = [],
		data = erddapParser.parseTabledapData(dataCsv)

	test.deepEqual(data,[])
	test.end();
})
