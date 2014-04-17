var vows   = require('vows');
var assert = require('assert');

var geocode = require('../lib/geocode');


vows.describe('Geocode').addBatch({
  'When requesting a valid geocode': {
    topic: function () {
      geocode.geocode({ text: "920 SW 3rd Ave, Portland, OR 97204" }, this.callback);
    },
    'It should return the correct latitude and longitude': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.locations.length, 1);
      assert.equal(data.locations[0].feature.geometry.x.toPrecision(7), (-122.67633658436517).toPrecision(7));
      assert.equal(data.locations[0].feature.geometry.y.toPrecision(7), (45.5167324388521).toPrecision(7));
    }
  },
  'When running using the "simple" method': {
    topic: function () {
      geocode.geocode.simple({ text: "920 SW 3rd Ave, Portland, OR 97204" }, this.callback);
    },
    'It should return the correct latitude and longitude': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.locations.length, 1);
      assert.equal(data.locations[0].feature.geometry.x.toPrecision(7), (-122.67633658436517).toPrecision(7));
      assert.equal(data.locations[0].feature.geometry.y.toPrecision(7), (45.5167324388521).toPrecision(7));
    }
  },
  'When using reverse geocoding': {
    topic: function () {
      geocode.geocode.reverse({ location: "-122.67633658436517,45.5167324388521" }, this.callback);
    },
    'It should return something pretty close to what it should': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.address.Address, "918 SW 3rd Ave");
    }
  },
  'When requesting all address matches using text': {
    topic: function () {
      geocode.geocode.addresses({ text: "920 3rd Ave, Portland, OR 97204" }, this.callback);
    },
    'It should return a sorted list of likely geocode matches': function (err, data) {
      assert.equal(err, null);
      assert.isTrue(data.candidates.length > 1);
      assert.isTrue(data.candidates[0].score > 90);
      assert.equal(data.candidates[0].location.x.toPrecision(7), (-122.67633658436517).toPrecision(7));
      assert.equal(data.candidates[0].location.y.toPrecision(7), (45.5167324388521).toPrecision(7));
      var lastMatch = data.candidates.pop();
    }
  },
  'When requesting all address matches using object': {
    topic: function () {
      geocode.geocode.addresses({
        Address: "920 3rd Ave",
        City: "Portland",
        Region: "OR",
        Postal: "97204" },
      this.callback);
    },
    'It should return a sorted list of likely geocode matches': function (err, data) {
      assert.equal(err, null);
      assert.isTrue(data.candidates.length > 1);
      assert.isTrue(data.candidates[0].score > 90);
      assert.equal(data.candidates[0].location.x.toPrecision(7), (-122.67633658436517).toPrecision(7));
      assert.equal(data.candidates[0].location.y.toPrecision(7), (45.5167324388521).toPrecision(7));
      var lastMatch = data.candidates.pop();
    }
  },
  'When batch geocoding': {
    'and no token is available': {
      topic: function () {
        var batch = new geocode.Batch();
        batch.geocode('123 Fake Street');

        var callback = this.callback;
        batch.run(function (err, data) {
          callback(null, err);
        });
      },
      'an error is returned': function (err, data) {
        assert.equal(data, "Valid authentication token is required");
      }
    },
    'and the token is expired': {
      topic: function () {
        var batch = new geocode.Batch({ token: "abc", expires: 123 });
        batch.geocode('123 Fake Street');

        var callback = this.callback;
        batch.run(function (err, data) {
          callback(null, err);
        });
      },
      'an error is returned': function (err, data) {
        assert.equal(data, "Valid authentication token is required");
      }
    }
  }
}).export(module);
