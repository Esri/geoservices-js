(function (root, factory) {
  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(factory);
  }

  // Browser Global.
  if(typeof window === "object") {
    root.Geoservices = factory();
  }

}(this, function () {
  var exports = { };

function stringify (obj) {
  var qs = [ ];
  for (var key in obj) {

    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        for (var i = 0, l = obj[key].length; i < l; i++) {
          qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key][i]));
        }
      } else {
        qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
  }

  return qs.join('&');
}

/**
 * @module Geostore
*/

/**
 * Authenticate a user against the Geostore Service for authenticated requests.
 * @param {String} username your username
 * @param {String} password your password
 * @param {Object} options can be null
 * @param {Function} callback to be called when authentication is complete
*/
function authenticate (username, password, options, callback) {
  var url = "https://www.arcgis.com/sharing/generateToken";

  if (this.options && this.options.authenticationUrl) {
    url = this.options.authenticationUrl;
  }

  var data = {
    username: username,
    password: password,
    f:        "json",
    referer:  "geoservices-js"
  };

  if (options) {
    if (options.expiration){
      data.expiration = options.expiration;
    }
    if (options.referer){
      data.referer = options.referer;
    }
  }

  var self = this;

  function internalCallback (err, data) {
    if (data) {
      self.token = data;
    }
    callback(err, data);
  }

  this.requestHandler.post(url, data, internalCallback);
}

function FeatureService (options, callback) {
  this.lastQuery = null;
  this.url       = null;
  this.options   = options;
  this.callback  = callback;

  this.requestHandler = { get: get, post: post };
  this.get();
}

FeatureService.prototype.buildUrl = function () {
  var options = this.options;

  var url;

  if (options.url) {
    url = options.url;
  } else {
    url = [ options.catalog, options.service, options.type ].join('/') + (options.layer ? '/' + options.layer : '');
  }

  return url;
};

FeatureService.prototype.get = function () {
  var options = this.options;
  var callback = this.callback;

  if (options &&
      !options.catalog && !options.service && !options.type &&
      !options.url ) {
    if (this.callback) {
      callback('Must provide at least a feature service "catalog", "service" and "type", or a "url" to a feature service or feature layer');
    }

    return;
  }

  this.url = this.buildUrl();

  this.token = options.token;

  this.issueRequest(null, {
    f: options.format || 'json'
  }, callback);
};


// internal callback wrapper for err logic
function _internalCallback(err, data, cb){
  if (cb) {
    // check for an error passed in this response
    if (data && data.error ) {
      cb( data.error, null);
    } else {
      cb( err, data );
    }
  }
}

FeatureService.prototype.issueRequest = function (endPoint, parameters, cb, method) {
  parameters.f = parameters.f || 'json';
  parameters.outFields = parameters.outFields || '*';
  if(parameters.token || this.token){
    parameters.token = parameters.token || this.token;
  }

  var urlPart = '';

  if (endPoint) {
    urlPart = '/' + endPoint;
  }

  var url = this.url + urlPart;

  if (!method || method.toLowerCase() === "get") {
    url = url + '?' + stringify(parameters);

    this.requestHandler.get(url, function(err, data){
      _internalCallback(err, data, cb);
    });
  } else {
    //assuming method is POST
    //TODO: change this to use method values if there are feature service operations that use PUT or DELETE
    this.requestHandler.post(url, parameters, function(err, data) {
      _internalCallback(err, data, cb);
    });
  }
};

// issues a query to the server
FeatureService.prototype.query = function (parameters, callback) {
  this.lastQuery = parameters;
  var method = parameters.method || 'get';
  delete parameters.method;
  this.issueRequest('query', parameters, callback, method);
};

// issues a count only query to the server
FeatureService.prototype.count = function (parameters, callback) {
  parameters.returnCountOnly = true;
  parameters.returnIdsOnly = false;
  this.query(parameters, callback);
};

// issues an id's only query to the server
FeatureService.prototype.ids = function (parameters, callback) {
  parameters.returnIdsOnly = true;
  parameters.returnCountOnly = false;
  this.query(parameters, callback);
};

// issues an update request on the feature service
FeatureService.prototype.update = function (parameters, callback) {
  this.issueRequest('updateFeatures', parameters, callback, 'post');
};

// issues an add request on the feature service
FeatureService.prototype.add = function (parameters, callback) {
  this.issueRequest('addFeatures', parameters, callback, 'post');
};

// issues a remove request on the feature service
FeatureService.prototype.remove = function (parameters, callback) {
  this.issueRequest('deleteFeatures', parameters, callback, 'post');
};

// issues an edit request on the feature service
// this applies adds, updates, and deletes in a single request
FeatureService.prototype.edit = function (parameters, callback) {
  issueRequest('applyEdits', parameters, callback, 'post');
};

/**
 * @module Geostore
*/
/**
 * @private
*/
function baseUrl(options) {
  var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

  if (options && options.geocoderUrl) {
    url = options.geocoderUrl;
  }

  return url;
}

/**
 * Access to a simple Geocode request
 * @param {Object} parameters 
 * @param {Function} callback to be called when geocode is complete
 * geoservice.geocode({ text: "920 SW 3rd Ave, Portland, OR 97204" }, callback);
*/
function geocode (parameters, callback) {
  parameters.f = parameters.f || "json";

  // build the request url
  var url = baseUrl(this.options);
  url += '/find?';

  url += stringify(parameters);

  this.requestHandler.get(url, callback);
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

  this.requestHandler.get(url, callback);
}

function addresses (parameters, callback) {
  if (!parameters.f) {
    parameters.f = 'json';
  }

  //build the request url
  var url = baseUrl(this.options);

  url += '/findAddressCandidates?';

  //allow a text query like simple geocode service to return all candidate addresses
  if (parameters.text) {
    parameters.SingleLine = parameters.text;
    delete parameters.text;
  }
  //at very least you need the Addr_type attribute returned with results
  if (!parameters.outFields) {
    parameters.outFields = "Addr_type";
  }

  if (parameters.outFields !== '*' && 
    parameters.outFields.indexOf('Addr_type') < 0) {
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
  if (!optionalId) {
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

  this.data.push({ attributes: data });
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
      records: this.data
    });

    var data = {
      token: this.token.token,
      addresses: internal,
      f: "json",
      referer: "geoservices-js"
    };

    var url = baseUrl(this.options);

    url += "/geocodeAddresses";  

    this.requestHandler.post(url, data, callback);
  }
};

reverse.requestHandler = { get: get, post: post };
geocode.requestHandler = { get: get, post: post };
addresses.requestHandler = { get: get, post: post };

geocode.simple  = geocode;
geocode.reverse = reverse;
geocode.addresses = addresses;

function GeoEnrichmentService(token, options) {
  this.token = token;
  this.options = options;
  this.requestHandler = { get: get, post: post };
}

function baseUrl(options) {
  var url = 'http://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver';
  if (options && options.geoEnrichUrl) url = options.geoEnrichUrl;
  return url;
}

// internal callback wrapper for err logic
function _internalCallback(err, data, cb) {
  if (cb) {
    // check for an error passed in this response
    if (data && data.error) {
      cb(data.error, null);
    } else {
      cb(err, data);
    }
  }
}

GeoEnrichmentService.prototype.issueRequest = function (endPoint, parameters, cb, method) {
  var current = new Date();

  if (!this.token || !this.token.token ||
    this.token.expires < current) {
    _internalCallback("Valid authentication token is required", "Valid authentication token is required", cb);
    return;
  }

  parameters.f = parameters.f || 'json';
  parameters.token = this.token.token;

  //Object or Array Parameters for GeoEnrichmentServices
  var objParamKeys = ['analysisVariables',
    'dataCollections',
    'geographyIDs',
    'geographyLayers',
    'geographyQuery',
    'intersectingGeographies',
    'reportFields',
    'studyAreas',
    'studyAreasOptions',
    'subGeographyLayer',
    'subGeographyQuery',
    'useData'
  ];

  for (var i = 0; i < objParamKeys.length; i++) {
    if (parameters.hasOwnProperty(objParamKeys[i]))
      parameters[objParamKeys[i]] = JSON.stringify(parameters[objParamKeys[i]]);
  }

  //build the request url
  var url = baseUrl(this.options);
  url += '/' + endPoint;

  if (!method || method.toLowerCase() === "get") {
    url += ('?' + stringify(parameters));

    this.requestHandler.get(url, function (err, data) {
      _internalCallback(err, data, cb);
    });
  } else {
    //assuming method is POST
    this.requestHandler.post(url, parameters, function (err, data) {
      _internalCallback(err, data, cb);
    });
  }
};

// issues an enrich request on the geoenrichment service
GeoEnrichmentService.prototype.enrich = function (parameters, callback) {
  this.issueRequest('GeoEnrichment/enrich', parameters, callback, 'post');
};

// issues a createReport request on the geoenrichment service
//@TODO: needs a binary response handler
/*GeoEnrichmentService.prototype.createReport = function (parameters, callback) {
 parameters.f = 'bin';
 this.issueRequest('GeoEnrichment/CreateReport', parameters, callback, 'post');
 };*/

// issues a dataCollections request on the geoenrichment service
GeoEnrichmentService.prototype.dataCollections = function (parameters, callback) {
  var endpoint = 'GeoEnrichment/dataCollections';
  if (parameters && parameters.country) endpoint += ('/' + parameters.country);
  this.issueRequest(endpoint, parameters, callback, 'get');
};

// issues a geographyQuery request on the geoenrichment service
GeoEnrichmentService.prototype.geographyQuery = function (parameters, callback) {
  this.issueRequest('StandardGeographyQuery/execute', parameters, callback, 'get');
};


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

function Geoservices(options) {
  this.options = options;

  this.geocode = geocode;
  this.GeoEnrichmentService = GeoEnrichmentService;
  this.FeatureService = FeatureService;
  this.authenticate = authenticate;
  this.requestHandler = { get: get, post: post };

  var self = this;

  this.geocode.Batch = function (optionalToken) {
    optionalToken = optionalToken || self.token;

    var batch = new geocode.Batch(optionalToken);
    batch.requestHandler = request;

    return batch;
  };


  this.GeoEnrichmentService = function (optionalToken) {
    optionalToken = optionalToken || self.token;

    var geoEnrichService = new geoenrichment.GeoEnrichmentService(optionalToken);
    //geoEnrichService.requestHandler = request;

    return geoEnrichService;
  };

  exports.Geoservices = Geoservices;

  return exports;
}
))
;
