var request = require('request');

/**
 * @module Geostore
*/

/**
 * Authenticate a user against the Geostore Service
 *
 * This module is designed to be mixed into a request client object.
 *
 * If authentication succeeds, we add the following to the calling object:
 *
 *     self.token.token
 *     self.token.expires
 *     self.token.ssl
 *
 * See {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000m5000000 generateToken API docs} for details
 *
 * @param {String} username your username
 * @param {String} password your password
 * @param {Object} options can be null
 * @param {Function} callback to be called when authentication is complete. Callback is passed `err` and `result` data.
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
    // If authentication succeeds, store the response as 'token' on the calling object
    // Keys in the 'data' object include 'token', 'expires', and 'ssl'
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
