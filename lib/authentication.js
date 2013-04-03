var request = require('./request');

function authenticate (username, password, options, callback) {
  console.dir(this);
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

  function internalCallback (err, data) {
    if (data) {
      this.token = data;
    }
  }
  request.post(url, data, internalCallback);
}

exports.authenticate = authenticate;
