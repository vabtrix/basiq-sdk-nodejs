const request = require("request"),
  Error = require("../errors/Error");

//require("request").debug = true;

const API = function(host) {
  this.options = {
    host: host,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return this;
};

API.prototype.setHeader = function(header, value) {
  this.options.headers[header] = value;

  return this;
};

API.prototype.send = function(path, method, data) {
  const options = {};
  options.uri = this.options.host + "/" + path;
  options.method = method.toUpperCase();
  options.headers = cloneObject(this.options.headers);

  if (data) {
    options.body = JSON.stringify(data);
    options.headers["Content-Length"] = options.body.length;
  }

  return new Promise(function(res, rej) {
    request(options, function(error, response, body) {
      if (error || response.statusCode > 299) {
        if (error) {
          return rej(error);
        } else {
          return rej(new Error(body, response.statusCode));
        }
      }
      try {
        res(!!body ? JSON.parse(body) : {});
      } catch (err) {
        rej(err);
      }
    });
  });
};

function cloneObject(obj) {
  if (null === obj || "object" !== typeof obj) return obj;
  const copy = obj.constructor();
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

module.exports = API;
