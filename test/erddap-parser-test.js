const tape = require("tap").test,
	  erddapParser = require("../").erddapParser,
	  testMetadata = require('./test_metadata.json'),
	  expectedParsedMetadata = require('./expected_metadata.json'),
	  expectedParsedMetadataRevisions = require('./expected_etadata_revision.json');


tape("parseDatasetMetadata() formats headers correctly", function(test){


	var metadata_csv = testMetadata,//mock metadata csv
		expected = expectedParsedMetadata,
		metadata = erddapParser.parseDatasetMetadata(metadata_csv);

	test.deepEqual(metadata[0], expected)
	test.equal(metadata[0]['Variable Name'],'air_temperature');
	test.equal(metadata[0]['long_name'],'Air Temperature');
	test.equal(metadata[0]['units'],'degree_Celsius');
	//test.deepEqual(metadata[0],)
	test.end();
})


tape("parseDatasetMetadataRevision() formats headers correctly", function(test){


	var metadata_csv = testMetadata,//mock metadata csv
		expected = expectedParsedMetadataRevisions,
		metadata = erddapParser.parseDatasetMetadataRevisions(metadata_csv);

	test.deepEqual(metadata[0].parameters[0], expected.parameters[0])
	test.equal(metadata[0].label,expected.label)
	test.end();
})


tape("parseTabledapData() formats data correctly", function(test){


	var dataCsv = [


		],
		data = erddapParser.parseTabledapData(dataCsv)

	test.deepEqual(data,[])
	test.end();
})
