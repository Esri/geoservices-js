var vows   = require('vows');
var assert = require('assert');

var authentication = require('../lib/authentication');

vows.describe('Authentication').addBatch({
  'When authenticating with a valid account': {
    topic: function () {
      // mock request
      var requestHandler = {
        post: function (url, data, callback) {
          callback(null, null, JSON.stringify({ token: 'abc123', expires: 1366662062704, ssl: false }));
        }
      };

      authentication.authenticate('foo', 'bar', { requestHandler: requestHandler }, this.callback);
    },
    'it should return a token': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.token, 'abc123');
    }
  },
  'When authenticating with a valid account and expiration': {
    topic: function () {
      // mock 
      var requestHandler = {
        post: function (url, data, callback) {
          callback(null, null, JSON.stringify({ token: 'abc123', expires: 1366662062704, ssl: false }));
        }
      };

      authentication.authenticate('foo', 'bar', { requestHandler: requestHandler }, this.callback);
    },
    'it should return a token': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.token, 'abc123');
    }
  },
  'When authenticating with an invalid account': {
    topic: function () {
      // mock 
      var requestHandler = {
        post: function (url, data, callback) {
          callback(null, null, JSON.stringify({ error: { code: 400, message: 'Unable to generate token.', details: [ 'Invalid username or password.' ] } }));
        }
      };

      authentication.authenticate('foo', 'bar', { requestHandler: requestHandler }, this.callback);
    },
    'it should return a token': function (err, data) {
      assert.equal(err, null);
      assert.equal(data.error.code, 400);
    }
  },
  'When invalid JSON is returned': {
      topic: function () {
        // mock request tu return bad JSON
        var requestHandler = {
          post: function (url, data, callback) {
            callback(null, null, 'NOT VALID JSON');
          }
        };
        authentication.authenticate('foo', 'bar', { requestHandler: requestHandler }, this.callback);
      },
      'it should return an error': function (err, data) {
        assert.equal(err, 'Error parsing JSON in authentication response: SyntaxError: Unexpected token N');
      }
    }
}).export(module);
