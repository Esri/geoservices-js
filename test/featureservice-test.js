var vows   = require('vows');
var assert = require('assert');

var featureservice = require('../lib/featureservice');

var params = {
  catalog: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services',
  service: 'Census',
  type: 'MapServer',
  layer: 3
};

var writeParams = {
  url: 'http://services.arcgis.com/OfH668nDRN7tbJh0/arcgis/rest/services/TDD/FeatureServer/0'
}

var writtenRecords = [];


vows.describe('FeatureService').addBatch({
  'When requesting a featureservice by catalog/type/service': {
    topic: function () {
      featureservice.FeatureService( params , this.callback);
    },
    'It should return the correct service metadata': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      //assert.equal(data.layers[0].name, 'hospitals');
    }
  },
  'When requesting a featureservice by url': {
    topic: function () {
      featureservice.FeatureService({
        url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3'
      } , this.callback);
    },
    'It should return the correct service metadata': function (err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      //assert.equal(data.layers[0].name, 'hospitals');
    }
  },
  'When sending a query to a feature service without any params': {
    topic: function () {
      var self = this;

      var fs = new featureservice.FeatureService( params , function(err, data){
        fs.query({f: 'json'}, self.callback);
      });
    },
    'It should return an error': function (err, data) {
      assert.notEqual(err, null);
      //assert.equal(data.layers.length, 0);
    }
  },
  'When sending a query with proper params': {
    topic: function(){
      var self = this;

      var query_params = {
        f: 'json',
        returnGeometry: true,
        where: '1=1'
        //spatialRel: 'esriSpatialRelIntersects',
        //geometry: '{%22xmin%22:-20037508.342788905,%22ymin%22:-13619533.071360048,%22xmax%22:-0.000004854053258895874,%22ymax%22:6417975.271424003}', //'-104,35.6,-94.32,41',
        //geometry: JSON.stringify({"xmin":-20037508.342788905,"ymin":-13619533.071360048,"xmax":-0.000004854053258895874,"ymax":6417975.271424003}), //'-104,35.6,-94.32,41',
        /*geometry: '-20037508.342788905,-13619533.071360048,-0.000004854053258895874,6417975.271424003', //'-104,35.6,-94.32,41',
        geometryType: 'esriGeometryEnvelope',
        inSR: '102100',
        outFields: '*',
        outSR: '4326'*/
      };

      var fs = new featureservice.FeatureService( params , function(err, data){
        fs.query(query_params, self.callback);
      });
    },
    'the result should contain features': function( err, data ){
      assert.equal( err, null );
      assert.notEqual( data.features.length, 0 );
    }
  },
  'When adding a JSON point object': {
    topic: function(){
      // "Name"
      // "Description"
      // "ShortIntNum"
      // "LongIntNum"
      // "FloatNum"
      // "SampleDateTime"

      var newRecord = {
        geometry: { 
          x: -12245143.987259885,
          y: 4865942.279503077,
          spatialReference: { wkid: 102100 } 
        },
        attributes: {
          Name: 'Sample JSON Record',
          Description: 'This is a sample record sent as a JSON object!',
          ShortIntNum: 64,
          LongIntNum: 1234567890,
          FloatNum: 123456.098765,
          SampleDateTime: new Date()
        }
      },
        queryParams = {
        features: [newRecord]
      };

      var self = this;

      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.add(queryParams, self.callback);
      });
    },
    'the result should contain a single success record': function( err, data ){
      assert.equal(err, null);
      assert.isNotNull(data);
      assert.include(data, 'addResults');
      assert.lengthOf(data.addResults,1);
      assert.isTrue(data.addResults[0].success);
      writtenRecords.push(data.addResults[0].objectId);
    }
  },
  'When adding a stringified JSON point object': {
    topic: function(){
      // "Name"
      // "Description"
      // "ShortIntNum"
      // "LongIntNum"
      // "FloatNum"
      // "SampleDateTime"

      var newRecord = {
        geometry: { 
          x: -12245143.987259885,
          y: 4865942.279503077,
          spatialReference: { wkid: 102100 } 
        },
        attributes: {
          Name: 'Sample String Record',
          Description: 'This is a sample record sent as a string!',
          ShortIntNum: 64,
          LongIntNum: 1234567890,
          FloatNum: 123456.098765,
          SampleDateTime: new Date()
        }
      },
        queryParams = {
        features: JSON.stringify([newRecord])
      };

      var self = this;

      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.add(queryParams, self.callback);
      });
    },
    'the result should contain a single success record': function( err, data ){
      assert.equal(err, null);
      assert.isNotNull(data);
      assert.include(data, 'addResults');
      assert.lengthOf(data.addResults,1);
      assert.isTrue(data.addResults[0].success);
      writtenRecords.push(data.addResults[0].objectId);
    }
  }}).addBatch({
  'When deleting records': {
    topic: function() {
      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        var payload = {objectIds:writtenRecords.join()};
        fs.remove(payload, self.callback);
      });
    },
    'the result should be a list of IDs': function(err, data) {
      assert.isNotNull(data);
      assert.include(data, 'deleteResults');
    },
    'the IDs returned should match the IDs sent and should each return success': function(err, data) {
      assert.lengthOf(data.deleteResults,writtenRecords.length);
      for (var i = 0; i < writtenRecords.length; i++) {
        assert.equal(data.deleteResults[i].objectId, writtenRecords[i]);
        assert.isTrue(data.deleteResults[i].success);
      }
      writtenRecords = [];
    }
  }
}).export(module);
