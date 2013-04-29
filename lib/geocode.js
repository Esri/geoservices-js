var querystring = require('querystring');

var stringify = querystring.stringify;

function geocode (parameters, callback) {
  parameters.f = parameters.f || "json";

  // build the request url
  var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?';
  url += stringify(parameters);

  this.requestHandler.get(url, callback);
}

function reverse (parameters, callback) {
  parameters.f = parameters.f || "json";

  // build the request url
  var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?';
  url += stringify(parameters);

  this.requestHandler.get(url, callback);
}

function addresses (parameters, callback) {
  parameters.f = parameters.f || "json";

  //build the request url
  var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?';

  //allow a text query like simple geocode service to return all candidate addresses
  if (parameters.text) {
    parameters.SingleLine = parameters.text;
    delete parameters.text;
  }
  //at very least you need the Addr_type attribute returned with results
  parameters.outFields = parameters.outFields || 'Addr_type';
  if (parameters.outFields !== '*' && parameters.outFields.indexOf('Addr_type') < 0) {
    parameters.outFields += ',Addr_type';
  }

  url += stringify(parameters);

  this.requestHandler.get(url, callback);
}

function Batch (token) {
  this.data = [ ];
  this.token = token;
}

Batch.prototype.geocode = function (data, optionalId) {
  if (optionalId === undefined || optionalId === null) {
    optionalId = this.data.length + 1;
  }

  if (typeof data === 'object') {
    data.OBJECTID = optionalId;
  } else if (typeof data === 'string') {
    data = {
      "SingleLine": data,
      OBJECTID: optionalId
    };
  }

  this.data.push({ attributes: data});
};

Batch.prototype.setToken = function (token) {
  this.token = token;
};

Batch.prototype.run = function (callback) {
  if (this.token === undefined || this.token === null ||
      this.token.token === undefined || this.token.token === null ||
      this.token.expires < +new Date()) {
    callback("Valid authentication token is required");
  } else {
    var data = {
      token: this.token.token,
      addresses: JSON.stringify({
        records: this.data
      }),
      f: "json",
      referer: "arcgis-node"
    };

    this.requestHandler.post("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses", data, callback);
  }
};

geocode.simple  = geocode;
geocode.reverse = reverse;
geocode.addresses = addresses;
exports.Batch   = Batch;
exports.geocode = geocode;
