# Feature Services

Feature Services are the primary way of accessing vector features from Esri services, and are very deep in terms of functionality. Below are some examples of accessing information about a feature service (metadata), and some actually feature data. 


## Feature Service Metadata via a url

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


## Feature Service Metadata via params 

Alternatively we can decompose the service url into params to provide more flexibility:

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


## Querying for features 

We can request actual features two ways: with parameters and without. If we dont send any params then we simply accept the defaults provided on the service itself. 

### No parameters

Here we request the default feature service query for data 

    var fs = client.featureservice( params , function(err, data){
      fs.query({f: 'json'}, function( err, result ){
        if (err) {
          console.error("ERROR: " + err);
        } else {
          console.log("Features: ", result );
        }
      });
    }); 

### Custom query parameters

Feature Services are very deep and powerful. We can pass any supported parameter via a params hash: 
    
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
    });


## Querying for related records 

We can request features from a related layer.  At the very least the relationshipId parameter must be specified.
    
    var query_params = {
      relationshipId: 0
    };

    var fs = client.featureservice( params , function(err, data){
      fs.queryRelatedRecords( query_params, function( err, result ){
        if (err) {
          console.error("ERROR: " + err);
        } else {
          console.log("Features: ", result );
        }
      });
    });



