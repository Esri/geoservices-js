var geocode        = require('./lib/geocode'),
    featureservice = require('./lib/featureservice'),
    authentication = require('./lib/authentication');

function Geoservices (options) {
  this.options = options;

  this.geocode = geocode.geocode;
  this.featureservice = featureservice.FeatureService;
  this.authenticate   = authentication.authenticate;

  var self = this;

  this.geocode.Batch = function (optionalToken) {
    optionalToken = optionalToken || self.token;

    var batch = new geocode.Batch(optionalToken);

    return batch;
  };
}

module.exports = exports = Geoservices;
