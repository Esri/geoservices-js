var request = require('./request'),
  querystring = require('querystring');

function featureservice ( options, callback ) {

  var _featureservice = {
    url: url, 
    query: query,
    update: update
  };
    
  var url = [ options.catalog, options.service, 'FeatureServer/0'].join('/').replace(/\s/g, ''); 
  
  // retrieves the service metadata 
  function get(){
    var fs_url = url + '?f=' + ( options.format || 'json' );
    if ( !options || !options.catalog || !options.service ){
      if ( callback ) { 
        callback('Must provide at least a feature service "catalog url" and "service"');
      }
    } 

    request.get( fs_url, function( err, data ) { 
      if ( callback ) { callback( err, data ); }
    });

  }

  
  // issues a query to the server  
  function query( params, callback ){

    url += '/query?' + querystring.stringify( params );
    console.log('URL', url);
    request.get( url, callback );
  }

  // issues an update request on the feature service 
  function update( params, callback ){

  }

  get();

  return _featureservice;

}


exports.featureservice = featureservice;
