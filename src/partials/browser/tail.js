function Geoservices (options) {
  this.options = options;

  this.geocode = geocode;
  this.geoenrichment = geoenrichment;
  this.FeatureService = FeatureService;
  this.authenticate   = authenticate;
  this.requestHandler = { get: get, post: post };

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

exports.Geoservices = Geoservices;

return exports;
}));
