var geocode        = require('./lib/geocode'),
    featureservice = require('./lib/featureservice');
    authentication = require('./lib/authentication');

function ArcGIS (options) {
  var self = this;
  this.options = options;

  this.geocode = geocode.geocode;
  this.featureservice = featureservice.featureservice;
  this.authenticate = authentication.authenticate;

  this.geocode.Batch = function (optionalToken) {
    optionalToken = optionalToken || self.token.token;

    return new geocode.Batch(optionalToken);
  };
}

exports.ArcGIS = ArcGIS;
