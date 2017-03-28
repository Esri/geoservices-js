var querystring = require('querystring');
var request = require('request');
var stringify = querystring.stringify;

/**
 * @module Geostore
*/
/**
 * @private
*/
function baseUrl(options) {
  var url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

  if (options && options.geocoderUrl) {
    url = options.geocoderUrl;
  }

  return url;
}

/**
 * Inspect the server response for errors, even when the status code is 200
 * @param {Object} actual error returned by the server
 * @param {Object} response headers returned by the server
 * @param {Function} the entity body returned by the server
*/
function _handleArcGISResponse (error, response, body, callback) {
  if (error) {
    callback(error);
  } else if (response.statusCode == 200) {
    var parsedResponse;
    try {
      parsedResponse = JSON.parse(body);
    } catch (jsonParsingError) {
      callback(jsonParsingError);
    }
    if (parsedResponse.error){
      // An error returned in the body JSON reponse will also be considered an error
      callback(parsedResponse.error);
    } else {
      callback(null, parsedResponse);
    }
  } else {
    callback('Unknown Error: HTTP status ' + response.statusCode);
  }
}

/**
 * Access to a simple Geocode request
 * @param {Object} parameters
 * @param {Function} callback to be called when geocode is complete
 * geoservice.geocode({ text: "920 SW 3rd Ave, Portland, OR 97204" }, callback);
*/
function geocode (parameters, callback) {
  if (!parameters.f) {
    parameters.f = 'json';
  }

  // allow a text query like simple geocode service to return all candidate addresses
  if (parameters.text) {
    parameters.singleLine = parameters.text;
    delete parameters.text;
  }

  // build the request url
  var url = baseUrl(this.options);

  url += '/findAddressCandidates?';

  // at very least you need the Addr_type attribute returned with results
  if (!parameters.outFields) {
    parameters.outFields = "Addr_type";
  }

  if (parameters.outFields !== '*' &&
    parameters.outFields.indexOf('Addr_type') < 0) {
    parameters.outFields += ',Addr_type';
  }

  url += stringify(parameters);

  request.get(url, function (error, response, body) {
    return _handleArcGISResponse(error, response, body, callback);
  });
}

/**
 * Reverse Geocode
 * @param {Object} parameters
 * @param {Function} callback to be called when reverse geocode is complete
*/
function reverse (parameters, callback) {
  parameters.f = parameters.f || "json";

  // build the request url
  var url = baseUrl(this.options);

  url += '/reverseGeocode?';
  url += stringify(parameters);

  request.get(url, function (error, response, body) {
    return _handleArcGISResponse(error, response, body, callback);
  });
}

function Batch (token) {
  this.records = [ ];
  this.token = token;
}

Batch.prototype.geocode = function (record, optionalId) {
  if (!optionalId) {
    optionalId = this.records.length + 1;
  }

  if (typeof record === 'object') {
    if (!record.hasOwnProperty('OBJECTID')) {
      record.OBJECTID = optionalId;
    }
  } else if (typeof record === 'string') {
    record = {
      "SingleLine": record,
      OBJECTID: optionalId
    };
  }

  this.records.push({ attributes: record });
};

Batch.prototype.setToken = function (token) {
  this.token = token;
};

Batch.prototype.run = function (callback) {
  var current = new Date();

  if (!this.token ||
      !this.token.token ||
      this.token.expires < current) {
    callback("Valid authentication token is required");
  } else {
    var internal = JSON.stringify({
      records: this.records
    });

    var data = {
      token: this.token.token,
      addresses: internal,
      f: "json",
      referer: "geoservices-js"
    };

    var url = baseUrl(this.options);

    url += "/geocodeAddresses";

    request.post(url, function (error, response, body) {
      return _handleArcGISResponse(error, response, body, callback);
    }).form(data);
  }
};

geocode.simple  = geocode;
geocode.reverse = reverse;
exports.Batch   = Batch;
exports.geocode = geocode;
