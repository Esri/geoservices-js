
var request     = require('./request'),
    querystring = require('querystring');

function geocode (parameters, callback) {
  parameters.f = parameters.f || "json";

  // build the request url
  var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?';
  url += querystring.stringify(parameters);

  request.get(url, callback);
}

function reverse (parameters, callback) {
  parameters.f = parameters.f || "json";

  // build the request url
  var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?';
  url += querystring.stringify(parameters);

  request.get(url, callback);
}

geocode.simple = geocode;
geocode.reverse = reverse;

exports.geocode = geocode;
