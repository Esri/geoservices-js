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
