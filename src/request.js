var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function get (url, callback) {
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
  httpRequest.setDisableHeaderCheck(true);

  httpRequest.open("GET", url);
  httpRequest.setRequestHeader("Referer", "arcgis-node");
  httpRequest.send(null);
}

exports.get = get;