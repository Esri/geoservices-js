var request = require('./request'),
  querystring = require('querystring');

function featureservice ( options, callback ) {
  
  if ( !options || !options.catalog || !options.service ){
    callback('Error: Must provide at least a feature service "catalog url" and "service"');
    return false;
  } 

  var url = options.catalog + '/'; 
   url += options.service + '/FeatureServer/0';
   url += '?f=' + ( options.format || 'json' );

  request.get( url, function( err, data ) { 
    callback( err, data );
  });

  return this;

}

 
function query( parameters, callback ){

} 

featureservice.query = query;

exports.featureservice = featureservice;
