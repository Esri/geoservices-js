var vows   = require('vows');
var assert = require('assert');

var geoservices = require('../index');

vows.describe('Integration').addBatch({
  'When requesting a valid geocode': {
    topic: function () {
      var esri = new geoservices();
      esri.geocode({ text: "920 SW 3rd Ave, Portland, OR 97204" }, this.callback);
    },
    'It should return the correct latitude and longitude': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.candidates.length, 10);
      assert.equal(data.candidates[0].location.x.toPrecision(7), (-122.67645787323158).toPrecision(7));
      assert.equal(data.candidates[0].location.y.toPrecision(7), (45.51650314320659).toPrecision(7));
    }
  }
}).export(module);
