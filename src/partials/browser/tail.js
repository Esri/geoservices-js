function ArcGIS (options) {
  this.options = options;

  this.geocode = geocode;
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
}

exports.ArcGIS = ArcGIS;

return exports;
}));
