# Feature Services

Feature Services are the primary way of accessing vector features from Esri services, and are very deep in terms of functionality. Below are some examples of accessing information about a feature service (metadata), and querying for actual features.

## Feature Service Metadata via a url

```js
// make a request to a feature service
client.featureservice({
    url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3'
  }, function ( err, result ) {
    if (err) {
      console.error("ERROR: " + err);
    } else {
      console.log("Got the FeatureService Metadata: ", result );
    }
  });
```

## Feature Service Metadata via params

Alternatively we can decompose the service url into params to provide more flexibility:

```js
// Our feature service endpoint is:
// http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3?f=json

// Decompose the endpoint into a series of parameters
var params = {
  catalog: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services',
  service: 'Census',
  type: 'MapServer',
  layer: 3
};

// make request to the service
client.featureservice( params , function (err, result) {
  if (err) {
    console.error("ERROR: " + err);
  } else {
    console.log("Got the FeatureService Metadata: ", result );
  }
});
```

## Methods for querying feature services

Method | Arguments | Description
--- | --- | ---
`query(<query options>, <callback>)` | [`options`](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) | Executes a query to filter using either SQL, a spatial clause or both simultaneously.  Returns an array of matching features.
`count(<query options>, <callback>)` |  [`options`](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) | Accepts the same argument, but this method returns only the count of features satisfying the filter.
`ids(<query options>, <callback>)` | [`options`](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) | Accepts the same argument.  This method returns an array of IDs corresponding to features that satisfy the filter.

We can form spatial/sql queries for features very flexibly. If we don't send any params we are simply accepting the defaults provided by the service itself.

### No parameters

Here we request the default feature service query for data

```js
var fs = client.featureservice( params , function(err, data){
  fs.query({f: 'json'}, function( err, result ){
    if (err) {
      console.error("ERROR: " + err);
    } else {
      console.log("Features: ", result );
    }
  });
});
```

### Custom query parameters

Feature Services are very deep and powerful. We can pass any [supported parameter](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) via a params hash:

```js
var query_params = {
  f: 'json',
  returnGeometry: true,
  where: '1=1',
  outSR: '4326'
};

var fs = client.featureservice( params , function(err, data){
  fs.query( query_params, function( err, result ){
    if (err) {
      console.error("ERROR: " + err);
    } else {
      console.log("Features: ", result );
    }
  });

  fs.count( query_params, function( err, result ){
    if (err) {
      console.error("ERROR: " + err);
    } else {
      console.log(result); // { count: 666 }
    }
  });

});
```

## Methods for passing edits to feature services

Method | Arguments | Description
--- | --- | ---
`add(addParams, <callback>)` | [`options`](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) | Expects a JSON object with a `features` property composed of an array of individual features.
`update([features], <callback>)` | [`options`](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) | Expects a JSON object with a `features` property composed of an array of individual features.
`remove([ids], <callback>)` | [`options`](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) | Expects a JSON object with an `objectIds` property composed of an array of individual ids.
`edit(<query options>, <callback>)` | [`options`](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Feature_Service_Layer/02r3000000r1000000/) | Allows for passing `adds`, `updates` and `deletes` simultaneously.

You can find examples of these methods in action in our [test suite](../test/featureservice-test.js) and more information about the associated RESTful operations below.

http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Apply_Edits_Feature_Service_Layer/02r3000000r6000000/
