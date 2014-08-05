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

var writtenRecords = [],
    templateRecord = {
      geometry: { 
        x: -12245143.987259885,
        y: 4865942.279503077,
        spatialReference: { wkid: 102100 } 
      },
      attributes: {
        Name: 'Sample JSON Record',
        Description: '',
        ShortIntNum: 64,
        LongIntNum: 1234567890,
        FloatNum: 123456.098765,
        SampleDateTime: new Date()
      }
    },
    updateTemplateRecord = {
      attributes: {
        Name: 'Sample JSON Record',
        Description: ''
      }
    },
    defaultDescription = 'This is a sample record sent as ',
    testExtent = {
      xmin : -20037507.842788249, 
      ymin : -30240971.458386172, 
      xmax : 20037507.842788249, 
      ymax : 30240971.458386205
    },
    xRndMax = testExtent.xmax - testExtent.xmin,
    yRndMax = testExtent.ymax - testExtent.ymin;

function getRandomPoint() {
  var pt = { 
    x: (Math.random() * xRndMax) + testExtent.xmin,
    y: (Math.random() * yRndMax) + testExtent.ymin,
    spatialReference: { wkid: 102100 } 
  };
  return pt;
}

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

vows.describe('FeatureService Editing').addBatch({
  'When adding a JSON point object': {
    topic: function(){
      var newRecord = templateRecord;
      newRecord.geometry = getRandomPoint();
      newRecord.attributes.Description = defaultDescription + 'a JSON object!';
      var addParams = { features: [newRecord] };

      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.add(addParams, self.callback);
      });
    },
    'there should be no error returned': function (err, data) {
      assert.equal(err, null);
    },
    'there should be data returned': function (err, data) {
      assert.isNotNull(data);
    },
    'the data should contain addResults': function (err, data) {
      assert.include(data, 'addResults');
    },
    'addResults should contain 1 success record': function( err, data ){
      assert.lengthOf(data.addResults,1);
      assert.isTrue(data.addResults[0].success);
      writtenRecords.push(data.addResults[0].objectId);
    }
  },
  'When adding a stringified JSON point object': {
    topic: function(){
      var newRecord = templateRecord;
      newRecord.geometry = getRandomPoint();
      newRecord.attributes.Description = defaultDescription + 'stringified JSON!'
      var addParams = { features: JSON.stringify([newRecord]) };

      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.add(addParams, self.callback);
      });
    },
    'there should be no error returned': function (err, data) {
      assert.equal(err, null);
    },
    'there should be data returned': function (err, data) {
      assert.isNotNull(data);
    },
    'the data should contain addResults': function (err, data) {
      assert.include(data, 'addResults');
    },
    'addResults should contain 1 success record': function( err, data ){
      assert.lengthOf(data.addResults,1);
      assert.isTrue(data.addResults[0].success);
      writtenRecords.push(data.addResults[0].objectId);
    }
  }
}).addBatch({ // Apply Edits
  'When applying add and update edits to a feature service with a JSON object': {
    topic: function() {
      var newRecord = templateRecord,
          updateRecord = updateTemplateRecord,
          editParams = {
            adds: [],
            updates: [],
            deletes: ''
          };

      newRecord.geometry = getRandomPoint();
      newRecord.attributes.Description = defaultDescription + 'a JSON object in a batch edit';
      editParams.adds.push(newRecord);

      updateRecord.geometry = getRandomPoint();
      updateRecord.attributes.Description = 'Record UPDATED with a JSON object in a batch edit';
      updateRecord.attributes["OBJECTID"] = writtenRecords[0];
      updateRecord.attributes.SampleDateTime = new Date();
      editParams.updates.push(updateRecord);

      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.edit(editParams, self.callback);
      });
    },
    'there should be no error returned': function (err, data) {
      assert.equal(err, null);
    },
    'there should be data returned': function (err, data) {
      assert.isNotNull(data);
    },
    'the data should contain addResults': function (err, data) {
      assert.include(data, 'addResults');
    },
    'addResults should contain 1 success value': function (err, data) {
      assert.lengthOf(data.addResults, 1);
      assert.isTrue(data.addResults[0].success);
      writtenRecords.push(data.addResults[0].objectId);
    },
    'the data should contain updateResults': function (err, data) {
      assert.include(data, 'updateResults');
    },
    'updateResults should contain 1 success value': function (err, data) {
      assert.lengthOf(data.updateResults, 1);
      assert.isTrue(data.updateResults[0].success);
    },
    'the data should contain deleteResults': function (err, data) {
      assert.include(data, 'deleteResults');
    },
    'deleteResults should contain no items': function (err, data) {
      assert.lengthOf(data.deleteResults, 0);
    }
  },
  'When applying add and update edits to a feature service with stringified JSON': {
    topic: function() {
      var newRecord = templateRecord,
          updateRecord = updateTemplateRecord,
          editParams = {
            adds: [],
            updates: [],
            deletes: ''
          };

      newRecord.geometry = getRandomPoint();
      newRecord.attributes.Description = defaultDescription + 'a JSON object in a batch edit';
      editParams.adds.push(newRecord);

      updateRecord.geometry = getRandomPoint();
      updateRecord.attributes.Description = 'Record UPDATED with a JSON object in a batch edit';
      updateRecord.attributes["OBJECTID"] = writtenRecords[0];
      updateRecord.attributes.SampleDateTime = new Date();
      editParams.updates.push(updateRecord);

      editParams.adds = JSON.stringify(editParams.adds);
      editParams.updates = JSON.stringify(editParams.updates);

      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.edit(editParams, self.callback);
      });
    },
    'there should be no error returned': function (err, data) {
      assert.equal(err, null);
    },
    'there should be data returned': function (err, data) {
      assert.isNotNull(data);
    },
    'the data should contain addResults': function (err, data) {
      assert.include(data, 'addResults');
    },
    'addResults should contain 1 success value': function (err, data) {
      assert.lengthOf(data.addResults, 1);
      assert.isTrue(data.addResults[0].success);
      writtenRecords.push(data.addResults[0].objectId);
    },
    'the data should contain updateResults': function (err, data) {
      assert.include(data, 'updateResults');
    },
    'updateResults should contain 1 success value': function (err, data) {
      assert.lengthOf(data.updateResults, 1);
      assert.isTrue(data.updateResults[0].success);
    },
    'the data should contain deleteResults': function (err, data) {
      assert.include(data, 'deleteResults');
    },
    'deleteResults should contain no items': function (err, data) {
      assert.lengthOf(data.deleteResults, 0);
    }
  }
}).addBatch({ // Updates
  'When updating records with a JSON object': {
    topic: function() {
      var updateRecord = updateTemplateRecord;
      updateRecord.geometry = getRandomPoint();
      updateRecord.attributes.Description = 'Record UPDATED with a JSON object!';
      updateRecord.attributes["OBJECTID"] = writtenRecords[0];
      updateRecord.attributes.SampleDateTime = new Date();
      var updateParams = { features: [updateRecord] };

      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.update(updateParams, self.callback);
      });
    },
    'there should be no error returned': function (err, data) {
      assert.equal(err, null);
    },
    'there should be data returned': function (err, data) {
      assert.isNotNull(data);
    },
    'the data should contain updateResults': function (err, data) {
      assert.include(data, 'updateResults');
    },
    'updateResults should contain a single success record': function( err, data ){
      assert.lengthOf(data.updateResults,1);
      assert.isTrue(data.updateResults[0].success);
    }
  },
  'When updating records with stringified JSON': {
    topic: function() {
      var updateRecord = updateTemplateRecord;
      updateRecord.geometry = getRandomPoint();
      updateRecord.attributes.Description = 'Record UPDATED with a JSON object!';
      updateRecord.attributes["OBJECTID"] = writtenRecords[1];
      updateRecord.attributes.SampleDateTime = new Date();
      var updateParams = { features: JSON.stringify([updateRecord]) };

      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        fs.update(updateParams, self.callback);
      });
    },
    'there should be no error returned': function (err, data) {
      assert.equal(err, null);
    },
    'there should be data returned': function (err, data) {
      assert.isNotNull(data);
    },
    'the data should contain updateResults': function (err, data) {
      assert.include(data, 'updateResults');
    },
    'updateResults should contain a single success record': function( err, data ){
      assert.lengthOf(data.updateResults,1);
      assert.isTrue(data.updateResults[0].success);
    }
  }
}).addBatch({ // Deletes
  'When deleting records': {
    topic: function() {
      var self = this;
      var fs = new featureservice.FeatureService( writeParams , function(err, data){
        var payload = {objectIds:writtenRecords.join()};
        fs.remove(payload, self.callback);
      });
    },
    'there should be no error returned': function (err, data) {
      assert.equal(err, null);
    },
    'there should be data returned': function (err, data) {
      assert.isNotNull(data);
    },
    'the data should contain deleteResults': function(err, data) {
      assert.include(data, 'deleteResults');
    },
    'deleteResults should contain as many results as IDs that were sent': function (err, data) {
      assert.lengthOf(data.deleteResults,writtenRecords.length);
    },
    'each ID in deleteResults should correspond by index to the ID sent': function(err, data) {
      for (var i = 0; i < writtenRecords.length; i++) {
        assert.equal(data.deleteResults[i].objectId, writtenRecords[i]);
      }
      writtenRecords = [];
    },
    'each result in deleteResults should be a success': function(err, data) {
      for (var i = 0; i < data.deleteResults[i].length; i++) {
        assert.isTrue(data.deleteResults[i].success);
      }
    }
  }
}).export(module);
