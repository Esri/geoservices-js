# Geoservices-js

[![Build Status](https://travis-ci.org/Esri/geoservices-js.svg?branch=master)](https://travis-ci.org/Esri/geoservices-js)

Node.js bindings for Geoservices.

This module exposes both authenticated and non-authenticated aspects of Geoservices such as [ArcGIS Online](http://www.arcgis.com/).

## Non-authenticated Services

* Geocoding
* Reverse Geocoding
* Addresses
* Feature Services

## Authenticated Services

* Bulk Geocoding

## Usage


#### Installing

    $ npm install geoservices

#### Basic Usage

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

## Further documentation

* [Feature Services](docs/FeatureServices.md) are the primary way of accessing vector features from Esri services, and are very deep in terms on functionality.
* [Geocoding](docs/Geocoding.md) documents how to do simple geocoding, reverse geocoding and batch geocoding.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

This is an open library for communicating with any service that implements the Geoservices specification.  The default endpoint for Geocoding is ArcGIS Online.  Please see [Terms of Use](http://resources.arcgis.com/en/help/arcgis-rest-api/#/ArcGIS_Online_services_licensing/02r3000001mv000000/) for licensing and usage details.

## See Also ##

 * [gecoder-arcgis](https://github.com/StephanGeorg/geocoder-arcgis) provides a client for just the Geocoding APIs with a promise-based design. 


[](Esri Tags: GeoServices Node.js Node)
[](Esri Language: JavaScript)
