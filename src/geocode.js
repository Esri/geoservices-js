
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

function Batch (token) {
  this.data = [ ];
  this.token = token;
}

Batch.prototype.geocode = function (data, optionalId) {
  if (optionalId === undefined || optionalId === null) {
    optionalId = this.data.length;
  }

  if (typeof data === 'object') {
    data.OBJECTID = optionalId;
  } else if (typeof data === 'string') {
    data = {
      "Address": data,
      OBJECTID: optionalId
    };
  }

  this.data.push(data);
};

Batch.prototype.setToken = function (token) {
  this.token = token;
};

Batch.prototype.run = function (callback) {
  var data = {
    token: this.token,
    addresses: JSON.stringify({
      records: this.data
    }),
    f: "json",
    referer: "arcgis-node"
  };

  request.post("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses", data, callback);
};



geocode.simple  = geocode;
geocode.reverse = reverse;
exports.Batch   = Batch;
exports.geocode = geocode;
