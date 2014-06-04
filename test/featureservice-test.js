var vows   = require('vows');
var assert = require('assert');

var featureservice = require('../lib/featureservice');

var params = {
  catalog: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services',
  service: 'Census',
  type: 'MapServer',
  layer: 3
};


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
  }
}).export(module);
