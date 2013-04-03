var vows   = require('vows');
var assert = require('assert');

var featureservice = require('../src/featureservice');

vows.describe('FeatureService').addBatch({
  'When requesting a featureservice': {
    topic: function () {

      var params = {
        catalog: 'http://servicesdev.arcgis.com/f126c8da131543019b05e4bfab6fc6ac/arcgis/rest/services',
        service: 'hospitals',
        format: 'json'
      };

      featureservice.featureservice( params , this.callback);
    },
    'It should return the correct service metadata': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data.name, 'hospitals');
    }
  }
}).export(module);
