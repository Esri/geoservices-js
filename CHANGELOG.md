# Changelog

## [Upcoming changes][Unreleased]

### Breaking Changes

* As per the recommendation of the Geocoding team, the `/find?` operation is no longer utilized.  Using `/findAddressCandidates?` exclusively has allowed us to simplify this API by removing the `addresses()` method entirely, but necessitates the following changes.

1. the response signature of `geocode()` now provides an array of candidates, not locations.
2. `singleLine` is now the appropriate parameter to use when supplying a single string to be located.

```js
client.geocode({ singleLine: "voodoo doughnuts" }, function (err, result) {
    console.log(result.candidates[0]); //
  }
});
```

## [1.1.1]

### Added
* Support for `queryRelatedRecords` method to `FeatureService`

### Fixed
* `FeatureService` can now be instantiated with/without `new`.
* batch geocoding now respects feature identifiers passed via the `optionalID` parameter *or* as an `OBJECTID` attribute.

## [1.1.0]

### Added
* Improvement to inline authentication documentation

### Changed

* Geocoder results are now inspected for errors and passed to callbacks appropriately even when the status code of the response is 200
* geocoding requests now utilize HTTPS

## 1.0.0

### Breaking Changes

* FeatureService calls now automatically detect JSON being passed in and no longer require coersion to `String`

[Unreleased]: https://github.com/Esri/geoservices-js/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/Esri/geoservices-js/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Esri/geoservices-js/compare/v1.0.0...v1.1.0
