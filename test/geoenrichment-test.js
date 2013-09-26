var vows = require('vows');
var assert = require('assert');

var request = require('../lib/request');
var geoenrichment = require('../lib/geoenrichment');

// stub in requestHandler
geoenrichment.requestHandler = request;

vows.describe('GeoEnrichmentService').addBatch({
  'When enriching a study area': {
    'and no token is available': {
      topic: function () {

        var params = {
          studyAreas: [
            {"geometry": {"x": -117.1956, "y": 34.0572}}
          ],
          dataCollections: ["KeyUSFacts"]
        }

        var callback = this.callback;
        var geoEnrichService = new geoenrichment.GeoEnrichmentService();
        geoEnrichService.enrich(params, callback);
      },
      'an error is returned': function (err, data) {
        assert.equal(data, "Valid authentication token is required");
      }
    },
    'and the token is expired': {
      topic: function () {
        var params = {
          studyAreas: [
            {"geometry": {"x": -117.1956, "y": 34.0572}}
          ],
          dataCollections: ["KeyUSFacts"]
        }

        var callback = this.callback;
        var geoEnrichService = new geoenrichment.GeoEnrichmentService();
        geoEnrichService.enrich(params, callback);
      },
      'an error is returned': function (err, data) {
        assert.equal(data, "Valid authentication token is required");
      }
    }
  }
}).export(module);
