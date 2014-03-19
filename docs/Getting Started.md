# Getting Started

This module exposes both authenticated and non-authenticated aspects of Geoservices such as [ArcGIS Online](http://www.arcgis.com/).

## Non-authenticated Services

* Geocoding
* Reverse Geocoding
* Addresses
* Feature Services

## Authenticated Services

* Bulk Geocoding

## Using in the Browser

    <script src="browser/geoservices.js"></script>
    <script>
      var client = new Geoservices();
    </script>

## Using in Node.js

### Installing

    $ npm install geoservices

### Basic Usage

    var Geoservices = require('geoservices');
    
    var client = new Geoservices();

## Further documentation

* [Feature Services](FeatureServices.md) are the primary way of accessing vector features from Esri services, and are very deep in terms on functionality.
* [Geocoding](Geocoding.md) documents how to do simple geocoding, reverse geocoding and batch geocoding.

For more information see the Geoservices Specification available at http://www.esri.com/library/whitepapers/pdfs/geoservices-rest-spec.pdf

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

This is an open library for communicating with any service that implements the Geoservices specification.  The default endpoint for Geocoding is ArcGIS Online.  Please see [Terms of Use](http://resources.arcgis.com/en/help/arcgis-rest-api/#/ArcGIS_Online_services_licensing/02r3000001mv000000/) for licensing and usage details.
