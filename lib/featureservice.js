var querystring = require('querystring');

var stringify = querystring.stringify;

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;



function get (url, callback) {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = _requestHandler(callback);

  httpRequest.open("GET", url);
  _maybeSetReferer(httpRequest);
  httpRequest.send(null);
}

function post (url, data, callback) {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = _requestHandler(callback);

  httpRequest.open("POST", url);
  _maybeSetReferer(httpRequest);
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  httpRequest.send(stringify(data));
}

function _requestHandler (callback) {
  return function () {
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
  };
}

// Node.js supports setting the Referer header, browsers do not as a security measure.
function _maybeSetReferer(httpRequest) {
  if (httpRequest.setDisableHeaderCheck !== undefined) {
    httpRequest.setDisableHeaderCheck(true);
    httpRequest.setRequestHeader("Referer", "geoservices-js");
  }
}


function FeatureService (options, callback) {
  this.lastQuery = null;
  this.url       = null;
  this.options   = options;
  this.callback  = callback;

  this.requestHandler = { get: get, post: post };
  console.log('wtf',options);
  this.get();
}

FeatureService.prototype.buildUrl = function () {
  var options = this.options;

  var url;
  console.log(this.options);
  if (this.options.url) {
    url = this.options.url;
  } else {
    url = [ this.options.catalog, this.options.service, this.options.type ].join('/') + (this.options.layer ? '/' + this.options.layer : '');
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

exports.FeatureService = FeatureService;
