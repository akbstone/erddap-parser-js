const tape = require("tap").test,
	  erddapParser = require("../").erddapParser,
	  testMetadata = require('./test_metadata.json'),
	  expectedParsedMetadata = require('./expected_metadata.json'),
	  expectedParsedMetadataRevisions = require('./expected_metadata_revision.json');


tape("parseDatasetMetadata() formats headers correctly", function(test){


	var metadata_csv = testMetadata,//mock metadata csv
		expected = expectedParsedMetadata,
		metadata = erddapParser.parseDatasetMetadata(metadata_csv);

	test.deepEqual(metadata.variables[0], expected)
	test.end();
})


tape("parseTabledapData() formats data correctly", function(test){


	var dataCsv = [

		],
		data = erddapParser.parseTabledapData(dataCsv)

	test.deepEqual(data,[])
	test.end();
})
