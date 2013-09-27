function Geoservices(options) {
  this.options = options;

  this.geocode = geocode;
  this.GeoEnrichmentService = GeoEnrichmentService;
  this.FeatureService = FeatureService;
  this.authenticate = authenticate;
  this.requestHandler = { get: get, post: post };

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
  exports.Geoservices = Geoservices;

  return exports;
}));
