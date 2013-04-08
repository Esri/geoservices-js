var request = require('./request'),
  querystring = require('querystring');

function featureservice ( options, callback ) {

  var _featureservice = {
    query: query,
    update: update
  };
  
  // retrieves the service metadata 
  function get(){
    if ( !options || !options.catalog || !options.service ){
      if ( callback ) { 
        callback('Must provide at least a feature service "catalog url" and "service"');
      }
    } 

    var url = [ options.catalog, options.service, 'FeatureServer/0'].join('/') + '?f=' + ( options.format || 'json' );

    _featureservice.url = url;

    request.get( url, function( err, data ) { 
      if ( callback ) { callback( err, data ); }
    });

  }

  
  // issues a query to the server  
  function query( parameters, callback ){

  }

  // issues an update request on the feature service 
  function update( parameters, callback ){

  }

  get();

  return _featureservice;

}


exports.featureservice = featureservice;
