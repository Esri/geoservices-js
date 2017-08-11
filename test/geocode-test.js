var vows   = require('vows');
var assert = require('assert');
var geocode = require('../lib/geocode');


vows.describe('Geocode').addBatch({
  'When requesting a valid geocode': {
    topic: function () {
      geocode.geocode({
        singleLine: "920 SW 3rd Ave, Portland, OR 97204"
      }, this.callback);
    },
    'It should return the correct latitude and longitude': function (err, data) {
      assert.equal(err, null);
      assert.isTrue(data.candidates.length > 1);
      assert.equal(data.candidates[0].location.x.toPrecision(7), (-122.67645970257969).toPrecision(7));
      assert.equal(data.candidates[0].location.y.toPrecision(7), (45.516501870102175).toPrecision(7));
    }
  },
  'When running using the "simple" method': {
    topic: function () {
      geocode.geocode.simple({
        singleLine: "920 SW 3rd Ave, Portland, OR 97204"
      }, this.callback);
    },
    'It should return the correct latitude and longitude': function (err, data) {
      assert.equal(err, null);
      assert.isTrue(data.candidates.length > 1);
      assert.equal(data.candidates[0].location.x.toPrecision(7), (-122.67645970257969).toPrecision(7));
      assert.equal(data.candidates[0].location.y.toPrecision(7), (45.516501870102175).toPrecision(7));
    }
  },
  'When using reverse geocoding': {
    topic: function () {
      geocode.geocode.reverse({ location: "-122.67633658436517,45.5167324388521" }, this.callback);
    },
    'It should return something pretty close to what it should': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.address.Address, "300 SW Taylor St");
    }
  },
  'When performing an invalid reverse geocode': {
    topic: function () {
      geocode.geocode.reverse({}, this.callback);
    },
    'we should parse the response manually for the error within the 200 status code message': function (err, data) {
      assert.equal(data, null);
      assert.equal(err.message, "Unable to complete operation.");
    }
  },
  'When requesting all address matches using singleLine': {
    topic: function () {
      geocode.geocode({ singleLine: "920 3rd Ave, Portland, OR 97204" }, this.callback);
    },
    'It should return a sorted list of likely geocode matches': function (err, data) {
      assert.equal(err, null);
      assert.isTrue(data.candidates.length > 1);
      assert.isTrue(data.candidates[0].score > 90);
      assert.equal(data.candidates[0].location.x.toPrecision(5), (-122.67633658436517).toPrecision(5));
      assert.equal(data.candidates[0].location.y.toPrecision(5), (45.5167324388521).toPrecision(5));
      var lastMatch = data.candidates.pop();
    }
  },
  'When requesting all address matches using object': {
    topic: function () {
      geocode.geocode({
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
      assert.equal(data.candidates[0].location.x.toPrecision(5), (-122.67633658436517).toPrecision(5));
      assert.equal(data.candidates[0].location.y.toPrecision(5), (45.5167324388521).toPrecision(5));
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
  },
  'When making an invalid simple request': {
    topic: function () {
      geocode.options = {geocoderUrl: "http://geocode.arcgis.com/arcgis/rest/services/foo"};
      geocode.geocode({ singleLine: "920 SW 3rd Ave, Portland, OR 97204" }, this.callback);
      geocode.options = null;
    },
    'we should parse the response manually for the error within the 200 status code message': function (err, data) {
      assert.equal(data, null);
      assert.equal(err.message, "Invalid URL");

    }
  },
  'When making a really invalid simple request': {
    topic: function () {
      geocode.options = {geocoderUrl: "http://foo.arcgis.com/arcgis/rest/services/GeocodeServer"};
      geocode.geocode({ singleLine: "920 SW 3rd Ave, Portland, OR 97204" }, this.callback);
      geocode.options = null;
    },
    'we should return the genuine error response from the server': function (err, data) {
      assert.equal(data, null);
      assert.equal(err.code, "ENOTFOUND");

    }
  }

}).export(module);
