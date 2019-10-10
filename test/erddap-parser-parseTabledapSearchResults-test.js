const tape = require("tap").test,
    erddapParser = require("../build/erddap-parser").erddapParser
    testTabledapSearchResults = require('./test_tabledapsearchresults.json'),
    expectedParsedTabledapSearchResults = require('./expected_tabledapsearchresults.json')

tape("parseTabledapSearchResults() formats data correctly", function(test){
    
    var tabledapsearchresults_csv = testTabledapSearchResults,
    expected = expectedParsedTabledapSearchResults,
    tabledapsearchresults = erddapParser.parseTabledapSearchResults(tabledapsearchresults_csv, );

    test.deepEqual(tabledapsearchresults[0], expected)
    test.end();

})