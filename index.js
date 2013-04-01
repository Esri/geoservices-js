var geocode = require('./lib/geocode');

function ArcGIS (options) {
  this.options = options;

  this.geocode = geocode.geocode;
}

exports.ArcGIS = ArcGIS;