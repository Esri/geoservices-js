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
            var enrich =  client.geoenrichment.Enrich();

            //SET YOUR ENRICH PROPERTIES HERE (SEE EXAMPLES BELOW)

            enrich.run(function (err, results) {
              console.dir(results);
                });
            }
    });

Run your script via node: `node test-geoenrichment.js`

###Enrichment for a Point with Defaults
    enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);

###Enrichment for a Point with a Data Collection
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setDataCollections(["KeyUSFacts"]);

###Enrichment for a Point with Analysis Variables
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);

###Specify Rings Around a Point with Analysis Variables
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);
	enrich.setStudyAreasOptions({"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[1,2,3]});

###Specify Drive Time Bands Around a Point with Analysis Variables
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);
	enrich.setStudyAreasOptions({"areaType":"DriveTimeBufferBands","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[3,5,7]});

###Specify Drive Time Buffers Around a Point with Analysis Variables
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);
	enrich.setStudyAreasOptions({"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15,20]});

###Specify Rings Around a Point with Analysis Variables and UseData Hint
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);
	enrich.setStudyAreasOptions({"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[1,2,3]});
	enrich.setUseData({"sourceCountry":"US"});

###Specify Ring Around a Point with Analysis Variables and Intersecting Zip Codes
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);
	enrich.setStudyAreasOptions({"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[20]});
	enrich.setIntersectingGeographies([{"geographyType":"standard","sourceCountry":"US", "geographyLayer":"US.ZIP5","name":"USZips","outfields":["ID"],"intersectionInfo":{"geometryType":"esriGeometryPolygon","spatialRel": "esriSpatialRelIntersects"}}]);

###Specify Ring Around a Point with Analysis Variables and Intersecting Zip Codes and Counties
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);
	enrich.setStudyAreasOptions({"areaType":"RingBuffer","bufferUnits":"esriMiles","bufferRadii":[20]});
	enrich.setUseData({"sourceCountry":"US"});
	enrich.setIntersectingGeographies([{"geographyType":"standard","sourceCountry":"US","geographyLayer":"US.Counties","name":"Counties","outfields":["ID","Name"],"intersectionInfo":{"geometryType":"esriGeometryPolygon","spatialRel":"esriSpatialRelIntersects"}},
		{"geographyType":"standard","sourceCountry":"US", "geographyLayer":"US.ZIP5","name":"USZips","outfields":["ID"],"intersectionInfo":{"geometryType":"esriGeometryPolygon","spatialRel": "esriSpatialRelIntersects"}}]);

###Specify Drive Time Buffers Around a Point with Analysis Variables and Return Drive Time Geometries
	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572}}]);
	enrich.setAnalysisVariables(["KeyGlobalFacts.TOTPOP", "AGE.MALE0", "AGE.MALE5"]);
	enrich.setStudyAreasOptions({"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15,20]});
	enrich.setReturnGeometry(true);

###Specify Drive Time Buffers Around Multiple Points with Data Collections
	enrich.setStudyAreas([{"geometry":{"x":-122.435,"y":37.785},"attributes":{"myID":"point1"}},{"geometry":{"x":-122.433,"y":37.734},"attributes":{"myID":"point2"}}]);
	enrich.setDataCollections(["KeyGlobalFacts","KeyUSFacts"]);
	enrich.setStudyAreasOptions({"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15,20]});

###Enrich a Custom Polygon with Data Collections
	enrich.setStudyAreas([{"geometry":{"rings":[[[-117.185412,34.063170],[-122.81,37.81],[-117.200570,34.057196],[-117.185412,34.063170]]],"spatialReference":{"wkid":4326}},"attributes":{"id":"1","name":"optional polygon area name"}}]);
	enrich.setDataCollections(["KeyGlobalFacts","KeyUSFacts"]);

###Enrich a Custom Polygon and Rings with Data Collections
	enrich.setStudyAreas([{"geometry":{"x":-122.435,"y":37.785},"attributes":{"myID":"point1"}},
		{"geometry":{"x":-122.433,"y":37.734},"attributes":{"myID":"point2"}},
		{"geometry":{"rings":[[[-117.185412,34.063170],[-122.81,37.81],[-117.200570,34.057196],[-117.185412,34.063170]]],"spatialReference":{"wkid":4326}},"attributes":{"id":"1","name":"optional polygon area name"}}]);
	enrich.setDataCollections(["KeyGlobalFacts","KeyUSFacts"]);
	enrich.setStudyAreasOptions({"areaType":"DriveTimeBuffer","bufferUnits":"esriDriveTimeUnitsMinutes","bufferRadii":[5,10,15]});

###Enrich Multiple Zip Codes with Data Collections
	enrich.setStudyAreas([{"sourceCountry":"US","layer":"US.ZIP5","ids":["92373","92129"]}]);
	enrich.setDataCollections(["KeyGlobalFacts","KeyUSFacts"]);

###Enrich a Zip Code that Contains the Specified Point with Data Collections
 	enrich.setStudyAreas([{"geometry":{"x":-117.1956,"y":34.0572},"areaType":"StandardGeography","intersectingGeographies":[{"sourceCountry":"US","layer":"US.ZIP5"}]}]);
 	enrich.setDataCollections(["KeyGlobalFacts","KeyUSFacts"]);

###Enrich a Point Via Address with Data Collections
	enrich.setStudyAreas([{"address":{"text":"380 New York St. Redlands, CA 92373"}}]);
	enrich.setDataCollections(["KeyGlobalFacts","KeyUSFacts"]);