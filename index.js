var geocode        = require('./lib/geocode'),
    featureservice = require('./lib/featureservice');
    authentication = require('./lib/authentication');

function ArcGIS (options) {
  this.options = options;

  this.geocode = geocode.geocode;
  this.featureservice = featureservice.featureservice;
  this.authenticate = authentication.authenticate;
}

exports.ArcGIS = ArcGIS;
