var request = require('./request');

function authenticate (username, password, options, callback) {
  var url = "https://www.arcgis.com/sharing/generateToken";

  var data = {
    username: username,
    password: password,
    f:        "json",
    referer:  "arcgis-node"
  };

  if (options && options.expiration) {
    data.expiration = options.expiration;
  }

  var self = this;

  function internalCallback (err, data) {
    if (data) {
      self.token = data;
    }
    callback(err, data);
  }

  request.post(url, data, internalCallback);
}

exports.authenticate = authenticate;