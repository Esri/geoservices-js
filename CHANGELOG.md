# Changelog

## 1.1.0

#### Changes

* Geocoder results are now inspected for errors and passed to callbacks appropriately even when the status code of the response is 200
* geocoding requests now utilize HTTPS

#### Misc
* Improvement to inline authentication documentation

## 1.0.0

#### Breaking Changes

* FeatureService calls automatically detect JSON being passed in and no longer require translation to String
