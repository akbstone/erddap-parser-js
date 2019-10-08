const tape = require("tape"),
	  erddapParser = require("../").erddapParser;




tape("parseDatasetMetadata() formats headers correctly", function(test){


	var metadata_csv = [
			{"Row Type": "variable", "Variable Name": "air_temperature", "Attribute Name": "", "Data Type": "double", Value: "", _FillValue: "-9999.99", id: "322100", ioos_category: "Other", long_name: "Air Temperature", missing_value: "-9999.99", platform: "station", standard_name: "air_temperature", units: "degree_Celsius", urn: "http://mmisw.org/ont/cf/parameter/air_temperature"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "_FillValue", "Data Type": "double", Value: "-9999.99"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "id", "Data Type": "String", Value: "322100"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "ioos_category", "Data Type": "String", Value: "Other"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "long_name", "Data Type": "String", Value: "Air Temperature"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "missing_value", "Data Type": "double", Value: "-9999.99"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "platform", "Data Type": "String", Value: "station"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "standard_name", "Data Type": "String", Value: "air_temperature"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "units", "Data Type": "String", Value: "degree_Celsius"},
			{"Row Type": "attribute", "Variable Name": "air_temperature", "Attribute Name": "urn", "Data Type": "String", Value: "http://mmisw.org/ont/cf/parameter/air_temperature"}
		],//mock metadata csv
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