/**
 * @module Geostore
*/
/**
 * @private
*/
function baseUrl(options) {
  var url = 'http://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/';

  if (options && options.geocoderUrl) {
    url = options.geocoderUrl;
  }

  return url;
}

function Enrich (token) {
  this.data = [ ];
  this.token = token;
}

Enrich.prototype.setToken = function (token) {
  this.token = token;
};

Enrich.prototype.setStudyAreas = function (studyAreas) {
    this.studyAreas = studyAreas;
};

Enrich.prototype.setDataCollections = function (dataCollections) {
    this.dataCollections = dataCollections;
};

Enrich.prototype.setAnalysisVariables = function (analysisVariables) {
    this.analysisVariables = analysisVariables;
};

Enrich.prototype.setStudyAreasOptions = function (studyAreasOptions) {
    this.studyAreasOptions = studyAreasOptions;
};

Enrich.prototype.setUseData = function (useData) {
    this.useData = useData;
};

Enrich.prototype.setIntersectingGeographies = function (intersectingGeographies) {
    this.intersectingGeographies = intersectingGeographies;
};

Enrich.prototype.setReturnGeometry = function (returnGeometry) {
    this.returnGeometry = returnGeometry;
};

Enrich.prototype.setInSR = function (inSR) {
    this.inSR = inSR;
};

Enrich.prototype.setOutSR = function (outSR) {
    this.outSR = outSR;
};

Enrich.prototype.setForStorage = function (forStorage) {
    this.forStorage = forStorage;
};


/**
 * Access to the GeoEnrichment service enrich method
 * @param {Function} callback to be called when enrichment is complete
*/
Enrich.prototype.run = function (callback) {
  var current = new Date();

  if (!this.token ||
      !this.token.token ||
      this.token.expires < current) {
    callback("Valid authentication token is required");
  } else {

    var data = {
        token: this.token.token,
        StudyAreas: this.studyAreas ? JSON.stringify(this.studyAreas) : '',
        dataCollections:  this.dataCollections ? JSON.stringify(this.dataCollections) : '',
        analysisVariables:  this.analysisVariables ? JSON.stringify(this.analysisVariables) : '',
        studyAreasOptions: this.studyAreasOptions ? JSON.stringify(this.studyAreasOptions) : '',
        useData: this.useData ? JSON.stringify(this.useData) : '',
        intersectingGeographies: this.intersectingGeographies ? JSON.stringify(this.intersectingGeographies) : '',
        returnGeometry: this.returnGeometry || false,
        inSR: this.inSR || '',
        outSR:  this.outSR || '',
        forStorage: this.returnGeometry || false,
        f: "json",
        referer: "geoservices-js"
    };

    var url = baseUrl(this.options);

    url += "/enrich";

    this.requestHandler.post(url, data, callback);
  }
};