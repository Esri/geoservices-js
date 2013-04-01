# arcgis-node

Node.js bindings for ArcGIS Online

## Usage

    var ArcGIS = require('arcgis').ArcGIS;
    
    var client = new ArcGIS({ /* optional credentials */ });

### Geocoding

    client.geocode({ text: "920 SW 3rd Ave, Portland, OR 97201" }, function (err, result) {
      if (err) {
        console.error("ERROR: " + err);
      } else {
        console.log("Found it at " + result.locations[0].feature.geometry.y + ", " result.locations[0].feature.geometry.x);
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
