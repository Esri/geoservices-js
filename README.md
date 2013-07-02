# Geoservices-js

Javascript bindings for Geoservices.  For more information see the Geoservices Specification available at http://www.esri.com/library/whitepapers/pdfs/geoservices-rest-spec.pdf

## Usage

### Browser

    <script src="browser/geoservices.js"></script>
    <script>
      var client = new Geoservices();
    </script>

### Node.js

    var Geoservices = require('geoservices');
    
    var client = new Geoservices();


## Building

Geoservices uses `grunt` for its build system.  To install:

    $ sudo npm install -g grunt-cli

To build and run tests, simply run:

    $ grunt

## Testing

Testing can also occur stand-alone:

    $ npm test

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

This is an open library for communicating with any service that implements the Geoservices specification.  The default endpoint for Geocoding is ArcGIS Online.  Please see [Terms of Use](http://resources.arcgis.com/en/help/arcgis-rest-api/#/ArcGIS_Online_services_licensing/02r3000001mv000000/) for licensing and usage details.


[](Esri Tags: Geoservices Node.js Browser)
[](Esri Language: JavaScript)
