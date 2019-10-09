const tape = require("tap").test,
    erddapParser = require("../").erddapParser

tape("createErddapUrl() formats basic URL correctly", function(test){
    const mock_server_url = "https://fake-test-server/erddap"
    const mock_dataset_id = "mock_dataset"
    test.equal(
        erddapParser.createErddapUrl({
            server: mock_server_url,
            dataset_id: mock_dataset_id,
            request: 'data'
        }),
        `${mock_server_url}/${mock_dataset_id}.csv?`
    );
	test.end();
})
