var querystring = require('querystring');

var stringify = querystring.stringify;

function featureservice(options, callback) {

  var _featureservice = {
    query: query,
    update: update,
    edit: edit,
    count: count,
    add: add,
    remove: remove,
    ids: ids,
    lastQuery: null,
    url: null
  };

  var requestHandler = this.requestHandler;
  // retrieves the service metadata 

  function get() {
    if (!options || !options.catalog || !options.service) {
      if (callback) {
        callback('Must provide at least a feature service "catalog url" and "service"');
      }
    }

    var url = [options.catalog, options.service, 'FeatureServer'].join('/') + (options.layer ? '/' + options.layer : '');

    _featureservice.url = url;

    _featureservice.token = options.token;

    issueRequest(null, {
      f: options.format || 'json'
    }, callback);
  }

  function issueRequest(endPoint, parameters, callback, method) {
    parameters.f = parameters.f || 'json';
    parameters.outFields = parameters.outFields || '*';
    if (_featureservice.token && !parameters.token) {
      parameters.token = _featureservice.token;
    }
    var url = _featureservice.url + (endPoint && endPoint != 'base' ? '/' + endPoint : '');
    if (!method || method.toLowerCase() == "get") {
      url += '?' + stringify(parameters);
      requestHandler.get(url, function(err, data) {
        if (callback) {
          callback(err, data);
        }
      });
    } else {
      requestHandler[method](url, parameters, function(err, data) {
        if (callback) {
          callback(err, data);
        }
      });
    }
  }

  // issues a query to the server  

  function query(parameters, callback) {
    _featureservice.lastQuery = parameters;
    var method = parameters.method || 'get';
    delete parameters.method;
    issueRequest('query', parameters, callback, method);
  }

  // issues a count only query to the server

  function count(parameters, callback) {
    parameters.returnCountOnly = true;
    parameters.returnIdsOnly = false;
    query(parameters, callback);
  }

  // issues an id's only query to the server

  function ids(parameters, callback) {
    parameters.returnIdsOnly = true;
    parameters.returnCountOnly = false;
    query(parameters, callback);
  }

  // issues an update request on the feature service 

  function update(parameters, callback) {
    issueRequest('updateFeatures', parameters, callback, 'post');
  }

  // issues an add request on the feature service 

  function add(parameters, callback) {
    issueRequest('addFeatures', parameters, callback, 'post');
  }

  // issues a remove request on the feature service 

  function remove(parameters, callback) {
    issueRequest('deleteFeatures', parameters, callback, 'post');
  }

  // issues an edit request on the feature service
  // this applies adds, updates, and deletes in a single request

  function edit(parameters, callback) {
    issueRequest('applyEdits', parameters, callback, 'post');
  }

  get();

  return _featureservice;

}


exports.featureservice = featureservice;