# Geocoding

## Creating the geocoding client

```javascript
    var Geoservices = require('geoservices');
    var client = new Geoservices();
```

## Simple geocoding

By default, geocoding uses simple single input field geocoding:

```javascript
    client.geocode({ text: "920 SW 3rd Ave, Portland, OR 97201" }, function (err, result) {
      if (err) {
        console.error("ERROR: " + err);
      } else {
        console.log("Found it at " + result.locations[0].feature.geometry.y + ", " + result.locations[0].feature.geometry.x);
      }
    });
```

`client.geocode` is a shortcut for calling `client.geocode.simple`.

## Reverse Geocoding

```javascript
      client.geocode.reverse({ location: "-122.67633658436517,45.5167324388521" }, function (err, result) {
      if (err) {
        console.error("ERROR: " + err);
      } else {
        console.log("Found it at " + result.address.Address + ", " + result.address.City);
      }
    });
```

## Batch Geocoding

Batch geocoding requires authentication.

To authenticate, the `authenticate` method is called, and the function you want to be run
with authentication is complete is passed in as a callback. This callback will be called
with `err` and `results` as arguments.

Within this callback, you should check for an error and then run your batch geocoding.

Optional arguments include the following:

 * **client**, the client identification type for which the token is to be generated.
    * If the value is specified as referer, the referer parameter must be specified.
    * If the value is specified as ip, the ip parameter must be specified.
    * If the value is specified as requestip, the IP address from where the request originated is used.
 * **referer**, the base URL of the web app that will invoke the request to access secured resource. This parameter must be specified if the value of the client parameter is referer.
    * Example: referer=http://myserver/mywebapp
 * **expiration**, the token expiration time in minutes. The default is 60 minutes.   The maximum value of the expiration time is controlled by the server. Requests for tokens larger than this time will return a token for the maximum allowed expiration time. Applications are responsible for renewing expired tokens; expired tokens will be rejected by the server on subsequent requests that use the token.
    * Example: expiration=60 (1 hour)
 * **ip**, the IP address of the machine that will invoke the request to access secured resource. This parameter must be specified if the value of the client parameter is ip.  
    * Example: ip=\#\#\#.\#\#\#.\#\#\#.\#\#\#

```javascript
    var client = new Geoservices();

    client.authenticate('username', 'password', { /* optional options */ }, function (err, results) {
        if (err) {
           console.log("ERROR: "+err);
        }
        else {
            var batch = new client.geocode.Batch();

            // add addresses to geocode
            batch.geocode("224 N. College Ave, Bloomington, Indiana");
            batch.geocode("456 Other Street");

            // run the batch
            batch.run(function (err, results) {
              console.dir(results);
            });
        }
    });
```

Given the above example, the `results` returned could be the following.  See
the [official ArcGIS REST API docs on the output format](http://resources.arcgis.com/en/help/arcgis-rest-api/02r3/02r300000017000000.htm) for the full documentation
of the fields returned.

Note that the "location" results are returned in the same order the inputs were provided. 

```json
    {
        "spatialReference": {
            "wkid": 4326,
            "latestWkid": 4326
        },
        "locations": [
            {
                "address": "224 N College Ave, Bloomington, Indiana, 47404",
                "location": {
                    "x": -86.53482371599966,
                    "y": 39.16786113700044
                },
                "score": 100,
                "attributes": {
                    "ResultID": 1,
                    "Loc_name": "USA.StreetAddress",
                    "Status": "M",
                    "Score": 100,
                    "Match_addr": "224 N College Ave, Bloomington, Indiana, 47404",
                    "Addr_type": "StreetAddress",
                    "PlaceName": "",
                    "Place_addr": "",
                    "Phone": "",
                    "URL": "",
                    "Rank": "",
                    "AddBldg": "",
                    "AddNum": "",
                    "AddNumFrom": "200",
                    "AddNumTo": "298",
                    "Side": "R",
                    "StPreDir": "N",
                    "StPreType": "",
                    "StName": "College",
                    "StType": "Ave",
                    "StDir": "",
                    "StAddr": "",
                    "Nbrhd": "",
                    "City": "Bloomington",
                    "Subregion": "",
                    "Region": "Indiana",
                    "Postal": "47404",
                    "PostalExt": "",
                    "Country": "USA",
                    "LangCode": "ENG",
                    "Distance": 0,
                    "X": -86.534825,
                    "Y": 39.167861,
                    "DisplayX": -86.534825,
                    "DisplayY": 39.167861,
                    "Xmin": -86.534963,
                    "Xmax": -86.534759,
                    "Ymin": 39.16747,
                    "Ymax": 39.16866
                }
            },
            {
                "address": "",
                "score": 0,
                "attributes": {
                    "ResultID": 2,
                    "Loc_name": "",
                    "Status": "U",
                    "Score": 0,
                    "Match_addr": "",
                    "Addr_type": "",
                    "PlaceName": "",
                    "Place_addr": "",
                    "Phone": "",
                    "URL": "",
                    "Rank": "",
                    "AddBldg": "",
                    "AddNum": "",
                    "AddNumFrom": "",
                    "AddNumTo": "",
                    "Side": "",
                    "StPreDir": "",
                    "StPreType": "",
                    "StName": "",
                    "StType": "",
                    "StDir": "",
                    "StAddr": "",
                    "Nbrhd": "",
                    "City": "",
                    "Subregion": "",
                    "Region": "",
                    "Postal": "",
                    "PostalExt": "",
                    "Country": "",
                    "LangCode": "",
                    "Distance": 0,
                    "X": 0,
                    "Y": 0,
                    "DisplayX": 0,
                    "DisplayY": 0,
                    "Xmin": 0,
                    "Xmax": 0,
                    "Ymin": 0,
                    "Ymax": 0
                }
            }
        ]
    }
```

## Further Reference

This geocoding client uses the ArcGIS REST API. Request options and Responses
documented here are based on that API. For the most current and official documentation of the API
see the [official ArcGIS REST API documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/The_ArcGIS_REST_API/02r300000054000000/).

