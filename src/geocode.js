
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    querystring    = require('querystring');

function geocode (parameters, callback) {
  httpRequest = new XMLHttpRequest();

  function requestHandler () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        try {
          var response = JSON.parse(this.responseText);
          callback(null, response);
        } catch (err) {
          callback("Invalid JSON on response");
        }
      }
    }
  }

  httpRequest.onreadystatechange = requestHandler;

  parameters.f = parameters.f || "json";

  // build the request
  var request = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?' + querystring.stringify(parameters);
  httpRequest.open("GET", request);
  httpRequest.send(null);
}

exports.geocode = geocode;