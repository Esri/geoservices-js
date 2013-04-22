var vows   = require('vows');
var assert = require('assert');

var request = require('../src/request');
var geocode = require('../src/geocode');

// stub in requestHandler
geocode.requestHandler = request;
geocode.geocode.requestHandler = request;
geocode.geocode.reverse.requestHandler = request;

vows.describe('Geocode').addBatch({
  'When requesting a valid geocode': {
    topic: function () {
      geocode.geocode({ text: "920 SW 3rd Ave, Portland, OR 97204" }, this.callback);
    },
    'It should return the correct latitude and longitude': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.locations.length, 1);
      assert.equal(data.locations[0].feature.geometry.x, -122.67633658436517);
      assert.equal(data.locations[0].feature.geometry.y, 45.5167324388521);
    }
  },
  'When running using the "simple" method': {
    topic: function () {
      geocode.geocode.simple({ text: "920 SW 3rd Ave, Portland, OR 97204" }, this.callback);
    },
    'It should return the correct latitude and longitude': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.locations.length, 1);
      assert.equal(data.locations[0].feature.geometry.x, -122.67633658436517);
      assert.equal(data.locations[0].feature.geometry.y, 45.5167324388521);
    }
  },
  'When using reverse geocoding': {
    topic: function () {
      geocode.geocode.reverse({ location: "-122.67633658436517,45.5167324388521" }, this.callback);
    },
    'It should return something pretty close to what it should': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.address.Address, "918 Sw 3rd Ave");
    }
  }
}).export(module);
