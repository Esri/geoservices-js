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
    
    var client = new Geosercices();


## Building

Geoservices uses `grunt` for its build system.  To install:

    $ sudo npm install -g grunt-cli

To build and run tests, simply run:

    $ grunt

## Testing

Testing can also occur stand-alone:

    $ npm test

[](Esri Tags: Geoservices Node.js Browser)
[](Esri Language: JavaScript)