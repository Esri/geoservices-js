var querystring = require('querystring');

var stringify = querystring.stringify;

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


function get (url, callback) {
  var httpRequest = new XMLHttpRequest();

  function requestHandler () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        try {
          var response = JSON.parse(this.responseText);
          callback(null, response);
        } catch (err) {
          callback("Invalid JSON on response: " + this.responseText);
        }
      }
    }
  }

  httpRequest.onreadystatechange = requestHandler;

  httpRequest.open("GET", url);
  if (httpRequest.setDisableHeaderCheck !== undefined) {
    httpRequest.setDisableHeaderCheck(true);
    httpRequest.setRequestHeader("Referer", "geoservices-js");
  }
  httpRequest.send(null);
}

function post (url, data, callback) {
  var httpRequest = new XMLHttpRequest();

  function requestHandler () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        try {
          var response = JSON.parse(this.responseText);
          callback(null, response);
        } catch (err) {
          callback("Invalid JSON on response: " + this.responseText);
        }
      }
    }
  }

  httpRequest.onreadystatechange = requestHandler;

  httpRequest.open("POST", url);
  if (httpRequest.setDisableHeaderCheck !== undefined) {
    httpRequest.setDisableHeaderCheck(true);
    httpRequest.setRequestHeader("Referer", "geoservices-js");
  }
  
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  httpRequest.send(stringify(data));
}

/**
 * @module Geostore
*/
/**
 * @private
*/
function baseUrl(options) {
  var url = 'http://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/';

  if (options && options.geocoderUrl) {
    url = options.geocoderUrl;
  }

  return url;
}

function Enrich (token) {
  this.data = [ ];
  this.token = token;
}

/**
 * Setup the GeoEnrichment service enrich request
 * @param {Object} data enrich request parameters
 * @param {int} optionalId
 * geoservice.enrich({ studyAreas: [...],dataCollections:["KeyGlobalFacts"],analysisVariables: ...  }, optionalId);
*/
Enrich.prototype.enrich = function (data, optionalId) {
  if (!optionalId) {
    optionalId = this.data.length + 1;
  }
  this.data.push({ attributes: data });
};

Enrich.prototype.setToken = function (token) {
  this.token = token;
};

/**
 * Access to the GeoEnrichment service enrich method
 * @param {Function} callback to be called when enrichment is complete
*/
Enrich.prototype.run = function (callback) {
  var current = new Date();

  if (!this.token ||
      !this.token.token ||
      this.token.expires < current) {
    callback("Valid authentication token is required");
  } else {
    var internal = JSON.stringify({
      records: this.data
    });

    var data = {
        token: this.token.token,
        studyAreas: internal,
        dataCollections: internal,
        analysisVariables: internal,
        studyAreasOptions: internal,
        useData: internal,
        intersectingGeographies: internal,
        returnGeometry: internal,
        inSR: internal,
        outSR: internal,
        forStorage: internal,
        f: "json",
        referer: "geoservices-js"
    };

    var url = baseUrl(this.options);

    url += "/enrich";

    this.requestHandler.post(url, data, callback);
  }
};
exports.Enrich = Enrich;