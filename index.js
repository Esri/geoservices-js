var geocode = require('./lib/geocode'),
  geoenrichment = require('./lib/geoenrichment'),
  featureservice = require('./lib/featureservice'),
  authentication = require('./lib/authentication'),
  request = require('./lib/request');

function Geoservices(options) {
  this.options = options;

  this.geocode = geocode.geocode;
  this.FeatureService = featureservice.FeatureService;
  this.authenticate = authentication.authenticate;
  this.requestHandler = request;

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
}

module.exports = exports = Geoservices;
