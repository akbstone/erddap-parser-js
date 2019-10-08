const tape = require("tap").test,
	  erddapParser = require("../").erddapParser,
	  testMetadata = require('./test_metadata.json');


tape("parseDatasetMetadata() formats headers correctly", function(test){


	var metadata_csv = testMetadata,//mock metadata csv
		metadata = erddapParser.parseDatasetMetadata(metadata_csv);


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
