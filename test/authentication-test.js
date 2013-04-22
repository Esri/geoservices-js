var vows   = require('vows');
var assert = require('assert');

var nock = require('nock');

var authentication = require('../lib/authentication');

vows.describe('Authentication').addBatch({
  'When authenticating with a valid account': {
    topic: function () {
      // mock 
      authentication.requestHandler = {
        post: function (url, data, callback) {
          callback(null, { token: 'abc123', expires: 1366662062704, ssl: false });
        }
      };

      authentication.authenticate('foo', 'bar', { }, this.callback);
    },
    'it should return a token': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.token, 'abc123');
    }
  },
  'When authenticating with a valid account and expiration': {
    topic: function () {
      // mock 
      authentication.requestHandler = {
        post: function (url, data, callback) {
          callback(null, { token: 'abc123', expires: 1366662062704, ssl: false });
        }
      };

      authentication.authenticate('foo', 'bar', { }, this.callback);
    },
    'it should return a token': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.token, 'abc123');
    }
  },
  'When authenticating with an invalid account': {
    topic: function () {
      // mock 
      authentication.requestHandler = {
        post: function (url, data, callback) {
          callback(null, { error: { code: 400, message: 'Unable to generate token.', details: [ 'Invalid username or password.' ] } });
        }
      };

      authentication.authenticate('foo', 'bar', { }, this.callback);
    },
    'it should return a token': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.error.code, 400);
    }
  }
}).export(module);
