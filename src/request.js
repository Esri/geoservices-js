

function get (url, callback) {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = _requestHandler(callback);

  httpRequest.open("GET", url);
  _maybeSetReferer(httpRequest);
  httpRequest.send(null);
}

function post (url, data, callback) {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = _requestHandler(callback);

  httpRequest.open("POST", url);
  _maybeSetReferer(httpRequest);
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  httpRequest.send(stringify(data));
}

function _requestHandler (callback) {
  return function () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        try {
          var response = JSON.parse(this.responseText);
          callback(null, response);
        } catch (err) {
          callback("Invalid JSON on response: " + this.responseText);
        }
      }
    }
  };
}

// Node.js supports setting the Referer header, browsers do not as a security measure.
function _maybeSetReferer(httpRequest) {
  if (httpRequest.setDisableHeaderCheck !== undefined) {
    httpRequest.setDisableHeaderCheck(true);
    httpRequest.setRequestHeader("Referer", "geoservices-js");
  }
}

