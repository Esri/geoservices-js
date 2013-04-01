# arcgis-node

Node.js bindings for ArcGIS Online

## Usage

    var ArcGIS = require('arcgis').ArcGIS;
    
    var client = new ArcGIS({ /* optional credentials */ });

### Geocoding

By default, geocoding uses simple single input field geocoding:

    client.geocode({ text: "920 SW 3rd Ave, Portland, OR 97201" }, function (err, result) {
      if (err) {
        console.error("ERROR: " + err);
      } else {
        console.log("Found it at " + result.locations[0].feature.geometry.y + ", " result.locations[0].feature.geometry.x);
      }
    });

#### Simple Geocoding

Simple geocoding is the same as the default `geocode` method:

    client.geocode.simple({ text: "920 SW 3rd Ave, Portland, OR 97201" }, function (err, result) {
      if (err) {
        console.error("ERROR: " + err);
      } else {
        console.log("Found it at " + result.locations[0].feature.geometry.y + ", " result.locations[0].feature.geometry.x);
      }
    });

#### Reverse Geocoding

      geocode.geocode.reverse({ location: "-122.67633658436517,45.5167324388521" }, function (err, result) {
      if (err) {
        console.error("ERROR: " + err);
      } else {
        console.log("Found it at " + result.address.Address + ", " + result.address.City);
      }
    });

## Building

ArcGIS-Node uses `grunt` for its build system.  To install:

    $ sudo npm install -g grunt-cli

To build and run tests, simply run:

    $ grunt

## Testing

Testing can also occur stand-alone:

    $ npm test
