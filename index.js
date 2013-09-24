var geocode        = require('./lib/geocode'),
    geoenrichment  = require('./lib/geoenrichment'),
    featureservice = require('./lib/featureservice'),
    authentication = require('./lib/authentication'),
    request        = require('./lib/request');

function Geoservices (options) {
  this.options = options;

  this.geocode = geocode.geocode;
  this.geoenrichment = geoenrichment.enrich;
  this.featureservice = featureservice.featureservice;
  this.authenticate   = authentication.authenticate;
  this.requestHandler = request;

  var self = this;

  this.geocode.Batch = function (optionalToken) {
    optionalToken = optionalToken || self.token;

    var batch = new geocode.Batch(optionalToken);
    batch.requestHandler = request;

    return batch;
  };

    this.geoenrichment.Enrich = function (optionalToken) {
      optionalToken = optionalToken || self.token;

      var enrich = new geoenrichment.Enrich(optionalToken);
        enrich.requestHandler = request;

      return enrich;
    };
}

module.exports = exports = Geoservices;
