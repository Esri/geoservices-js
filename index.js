var geocode        = require('./lib/geocode'),
    authentication = require('./lib/authentication');

function ArcGIS (options) {
  this.options = options;

  this.geocode = geocode.geocode;
  this.authenticate = authentication.authenticate;
}

exports.ArcGIS = ArcGIS;