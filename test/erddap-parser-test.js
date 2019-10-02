const tape = require("tape"),
	  erddap_parser = require("../").erddap_parser;




tape("parse_tabledap_metadata() formats headers correctly", function(test){


	var metadata_csv = [],//mock metadata csv
		metadata = erddap_parser.parse_tabledap_metadata(metadata_csv);

	test.equal(metadata,22)
	test.end();
})



tape("parse_tabledap_data() formats data correctly", function(test){


	var metadata_csv = [],//mock metadata csv
		data_csv = [],
		metadata = erddap_parser.parse_tabledap_metadata(metadata_csv),
		data = erddap_parser.parse_tabledap_data(data_csv,data)

	test.equal(data,33)
	test.end();
})