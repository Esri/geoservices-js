var request = require('request');

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

  function internalCallback (err, body, data) {
    var token;

    if (data) {
      try {
        token = JSON.parse(data);
        self.token = token;
      } catch (jsonParseError) {
        callback("Error parsing JSON in authentication response: "+jsonParseError, token);
        return;
      }
    }

    callback(err, token);
  }

  if (options.requestHandler) {
    options.requestHandler.post(url, data, internalCallback);
  } else {
    request.post({url:url,form:data}, internalCallback);
  }
}

// allow for overriding for mocking
authenticate.request = request;

exports.authenticate = authenticate;
