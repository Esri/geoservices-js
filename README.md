# Geoservices-js

[![Build Status](https://travis-ci.org/Esri/geoservices-js.svg?branch=master)](https://travis-ci.org/Esri/geoservices-js)

Node.js bindings for Geoservices.

This module abstracts making both authenticated and anonymous common [Geoservices](http://geoservices.github.io/) requests and parsing their response.

## Anonymously accessible services

* Geocoding
* Reverse Geocoding
* Addresses
* Feature Services

## Services that require authentication

* Bulk Geocoding

## Usage

#### Installing

```
$ npm install geoservices
```

#### Basic Usage

```js
var Geoservices = require('geoservices');

var client = new Geoservices();
```

## Building

Geoservices uses `grunt` for its build system.  To install:

```
$ sudo npm install -g grunt-cli
```

To build and run tests, simply run:

```
$ grunt
```

## Testing

Standalone testing can also be run:

```
$ npm test
```

## Further documentation

* [Feature Services](docs/FeatureServices.md) allow you to interact with feature geometry and attributes from Esri services
* [Geocoding](docs/Geocoding.md) is turning an address or place name into a location. The documentation describes simple geocoding, reverse geocoding and batch geocoding.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

This is an open library for communicating with any service that implements the Geoservices specification.  The default endpoint for Geocoding is ArcGIS Online.  Please see [Terms of Use](http://resources.arcgis.com/en/help/arcgis-rest-api/#/ArcGIS_Online_services_licensing/02r3000001mv000000/) for licensing and usage details.

## See Also

 * [gecoder-arcgis](https://github.com/StephanGeorg/geocoder-arcgis) provides a client for just the Geocoding APIs with a promise-based design.