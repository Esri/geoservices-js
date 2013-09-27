# GeoEnrichment

## Example Setup
The examples below can be added to a script and run via node on the command line.  You can install the geoservices-js module locally by going to your example script's directory and using npm:

      npm install YOUR\PATH\TO\geoservices-js

Let's say you have a script called `test-geoenrichment.js`.  You can include the geoservices module like so at the top of your script:

    var Geoservices  = require('geoservices');
    var client =  new Geoservices();

    client.authenticate('YOUR USERNAME', 'YOUR PASSWORD', null,function (err, data) {
      if (err) {
        console.error("ERROR: " + err);
      } else {
            var gs =  client.GeoEnrichmentService();

            //SET YOUR ENRICH PROPERTIES HERE (SEE EXAMPLES BELOW)

            //AND THEN CALL ONE OF THE GEOENRICHMENT METHODS HERE:

            //gs.dataCollections( params, callback);
            //gs.geographyQuery( params, callback);
            //gs.enrich( params, callback);
            //gs.createReport( params, callback);
    });

Run your script via node: `node test-geoenrichment.js`

##DataCollections Examples
###Return list of data collections that can be run in any country
    gs.dataCollections( {}, callback);

###Return list of data collections that can be run in Canada
    gs.dataCollections( {country:'Canada'}, callback);

##GeographyQuery Example Parameters
###Query for specific US zip codes
	var params = {
	    sourceCountry:'US',
	    geographyLayers:['US.ZIP5'],
	    geographyIDs:['92129','92126'],
	    generalizationLevel: 6,
	    returnGeometry: true
    }


##Enrich Example Parameters
###Enrichment for a Point with Defaults
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
    }

###Enrichment for a Point with a Data Collection
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    dataCollections : ["KeyUSFacts"]
    }

###Enrichment for a Point with Analysis Variables
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]
    }

###Specify Rings Around a Point with Analysis Variables
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"],
	    studyAreasOptions:{"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[1,2,3]}
    }

###Specify Drive Time Bands Around a Point with Analysis Variables
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"],
	    studyAreasOptions:{"areaType":"DriveTimeBufferBands","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[3,5,7]}
	}

###Specify Drive Time Buffers Around a Point with Analysis Variables
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"],
	    studyAreasOptions:{"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15,20]}
    }

###Specify Rings Around a Point with Analysis Variables and UseData Hint
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"],
	    studyAreasOptions:{"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[1,2,3]},
	    useData : {"sourceCountry":"US"}
    }

###Specify Ring Around a Point with Analysis Variables and Intersecting Zip Codes
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"],
	    studyAreasOptions:{"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[20]},
	    useData : {"sourceCountry":"US"},
	    intersectingGeographies: [{"geographyType":"standard","sourceCountry":"US", "geographyLayer":"US.ZIP5","name":"USZips","outfields":["ID"],"intersectionInfo":{"geometryType":"esriGeometryPolygon","spatialRel": "esriSpatialRelIntersects"}}]
    }

###Specify Ring Around a Point with Analysis Variables and Intersecting Zip Codes and Counties
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"],
	    studyAreasOptions:{"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[20]},
	    useData : {"sourceCountry":"US"},
	    intersectingGeographies: [{"geographyType":"standard","sourceCountry":"US","geographyLayer":"US.Counties","name":"Counties","outfields":["ID","Name"],"intersectionInfo":{"geometryType":"esriGeometryPolygon","spatialRel":"esriSpatialRelIntersects"}},
		{"geographyType":"standard","sourceCountry":"US", "geographyLayer":"US.ZIP5","name":"USZips","outfields":["ID"],"intersectionInfo":{"geometryType":"esriGeometryPolygon","spatialRel": "esriSpatialRelIntersects"}}]
    }

###Specify Drive Time Buffers Around a Point with Analysis Variables and Return Drive Time Geometries
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    analysisVariables : ["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"],
	    studyAreasOptions:{"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15,20]},
	    useData : {"sourceCountry":"US"},
	    returnGeometry:true
    }

###Specify Drive Time Buffers Around Multiple Points with Data Collections
	var params = {
	    studyAreas:[{"geometry":{"x":-122.435,"y":37.785},"attributes":{"myID":"point1"}},{"geometry":{"x":-122.433,"y":37.734},"attributes":{"myID":"point2"}}],
	    dataCollections : ["KeyGlobalFacts","KeyUSFacts"],
	    studyAreasOptions:{"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15,20]}
    }

###Enrich a Custom Polygon with Data Collections
	var params = {
	    studyAreas:[{"geometry":{"rings":[[[-117.185412,34.063170],[-122.81,37.81],[-117.200570,34.057196],[-117.185412,34.063170]]],"spatialReference":{"wkid":4326}},"attributes":{"id":"1","name":"optional polygon area name"}}],
	    dataCollections : ["KeyGlobalFacts","KeyUSFacts"]
	}

###Enrich a Custom Polygon and Rings with Data Collections
	var params = {
	    studyAreas:[{"geometry":{"x":-122.435,"y":37.785},"attributes":{"myID":"point1"}},
		{"geometry":{"x":-122.433,"y":37.734},"attributes":{"myID":"point2"}},
		{"geometry":{"rings":[[[-117.185412,34.063170],[-122.81,37.81],[-117.200570,34.057196],[-117.185412,34.063170]]],"spatialReference":{"wkid":4326}},"attributes":{"id":"1","name":"optional polygon area name"}}],
	    dataCollections : ["KeyGlobalFacts","KeyUSFacts"],
	    studyAreasOptions:{"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15]}
    }

###Enrich Multiple Zip Codes with Data Collections
	var params = {
	    studyAreas:[{"sourceCountry":"US","layer":"US.ZIP5","ids":["92373","92129"]}],
	    dataCollections : ["KeyGlobalFacts","KeyUSFacts"]
	}

###Enrich a Zip Code that Contains the Specified Point with Data Collections
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572},"areaType":"StandardGeography","intersectingGeographies":[{"sourceCountry":"US","layer":"US.ZIP5"}]}],
	    dataCollections : ["KeyGlobalFacts","KeyUSFacts"]
	}

###Enrich a Point Via Address with Data Collections
	var params = {
	    studyAreas:[{"address":{"text":"380 New York St. Redlands, CA 92373"}}],
	    dataCollections : ["KeyGlobalFacts","KeyUSFacts"]
	}

##CreateReport Example Parameters
###Run a 'Net Worth Profile' report for a 3 ring study area
	var params = {
	    studyAreas:[{"geometry":{"x":-117.1956,"y":34.0572}}],
	    studyAreasOptions:{"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[1,2,3]},
	    report:'Net Worth Profile',
	    format:'pdf',
	    reportFields:{"title": "My Report","subtitle": "Produced by Foo company"}
    }