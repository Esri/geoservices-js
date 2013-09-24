var vows   = require('vows');
var assert = require('assert');

var request = require('../lib/request');
var geoenrichment = require('../lib/geoenrichment');
var authentication = require('../lib/authentication');

// stub in requestHandler
geoenrichment.requestHandler = request;

vows.describe('Geoenrichment').addBatch({
  'When enriching a study area': {
    'and no token is available': {
      topic: function () {
        var enrich = new geoenrichment.Enrich();
        enrich.enrich({ studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
                  analysisVariables:["KeyGlobalFacts.TOTPOP"],
                  studyAreasOptions:{"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[10]}});
        var callback = this.callback;
        enrich.run(function (err, data) {
          callback(null, err);
        });
      },
      'an error is returned': function (err, data) {
        assert.equal(data, "Valid authentication token is required");
      }
    },
    'and the token is expired': {
      topic: function () {
        var enrich = new geoenrichment.Enrich({ token: "abc", expires: 123 });
          enrich.enrich({ studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
                    analysisVariables:["KeyGlobalFacts.TOTPOP"],
                    studyAreasOptions:{"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[10]}});

        var callback = this.callback;
          enrich.run(function (err, data) {
          callback(null, err);
        });
      },
      'an error is returned': function (err, data) {
        assert.equal(data, "Valid authentication token is required");
      }
    }
  }
}).export(module);
