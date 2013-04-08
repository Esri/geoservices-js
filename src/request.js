var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    querystring    = require('querystring');

function get (url, callback) {
  var httpRequest = new XMLHttpRequest();

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
  httpRequest.setDisableHeaderCheck(true);

  httpRequest.open("GET", url);
  httpRequest.setRequestHeader("Referer", "arcgis-node");
  httpRequest.send(null);
}

function post (url, data, callback) {
  var httpRequest = new XMLHttpRequest();

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
  httpRequest.setDisableHeaderCheck(true);

  httpRequest.open("POST", url);
  httpRequest.setRequestHeader("Referer", "arcgis-node");
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  httpRequest.send(querystring.stringify(data));
}

exports.get = get;
exports.post = post;
