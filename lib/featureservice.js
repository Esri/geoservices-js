var querystring = require('querystring');

var stringify = querystring.stringify;

function FeatureService (options, callback) {
  this.lastQuery = null;
  this.url       = null;
  this.options   = options;
  this.callback  = callback;

  this.requestHandler = exports.requestHandler;

  this.get();
}

FeatureService.prototype.get = function () {
  var url;

  if (!this.options &&
      (!this.options.catalog && !this.options.service && !this.options.type) &&
      !this.options.url ) {
    if (this.callback) {
      this.callback('Must provide at least a feature service "catalog", "service" and "type", or a "url" to a feature service or feature layer');
    }
  } else {
    if (this.options.url) {
      url = this.options.url;
    } else {
      url = [ this.options.catalog, this.options.service, this.options.type ].join('/') + (this.options.layer ? '/' + this.options.layer : '');
    }

    this.url = url;

    this.token = this.options.token;

    this.issueRequest(null, {
      f: this.options.format || 'json'
    }, this.callback);
  }
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
  if (this.token && !parameters.token) {
    parameters.token = this.token;
  }

  var handler = this.requestHandler;

  var url = this.url + (endPoint && endPoint !== 'base' ? '/' + endPoint : '');
  if (!method || method.toLowerCase() === "get") {
    url += '?' + stringify(parameters);
    handler.get(url, function(err, data){
      _internalCallback(err, data, cb);
    });
  } else {
    handler[method](url, parameters, function(err, data) {
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