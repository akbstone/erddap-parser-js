# erddap-parser

https://observablehq.com/@akbstone/test-from-erddap
See where ``variable`` and ``variable_object`` are defined

---

## Install
```
npm install erddap-parser
```

## API

```
createErddapUrl({
    erddap_server:'https://...',
    protocol:'tabledap',
    request: 'search' || 'data' || 'metadata', // default 'data'
    variables:['time','air_temperature',...],
    constraints: {
        'time>=': '2016-07-10T00:00:00Z',
        'time<=': '2017-02-10T00:00:00Z'
    },
    //optional
    variable_names:{
        erddap_variable:'output_key',
        air_temperature:'value
    }

})
```
- ``createErddapQueryString(ob)``
- ``createErddapURLPath(ob)``
- ``getErddapData(ob)``
- ``getTabledapData(ob)``
- ``searchTabledap(ob)``
- ``parseTabledapSearchResults(ob)``
- ``getTabledapData(ob)``
- ``getDatasetMetadata(ob)``
- ``parseDatasetMetadata(metadaCSV,ob)``
- ``parseTabledapData(dataCSV,ob)``

## dev install
```
git clone https://github.com/akbstone/erddap-parser-js.git
cd erddap-parser-js
npm install .
npm test
npm start
```

NOTES
-----

For updates to get picked up by erddap-realtime-app:

- ``npm run build`` builds a slim version that expects d3 methods to be included globally + version that includes dependencies embdedded
- Bump package version
- Run ``npm update`` from erddap-realtime-app
- Would be fixed by using NPM to publish this
