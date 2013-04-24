# Getting Started

This module exposes both authenticated and non-authenticated aspects of [ArcGIS Online](http://www.arcgis.com/).

## Non-authenticated Services

* Geocoding
* Reverse Geocoding
* Addresses
* Feature Services

## Authenticated Services

* Bulk Geocoding
* Directions
* Routing

## Using in Node.js

### Installing

    $ npm install arcgis

### Basic Usage

    var ArcGIS = require('arcgis').ArcGIS;
    
    var client = new ArcGIS();
