function Error(body, statusCode) {
  if (this === undefined) {
    return new Error(body, statusCode);
  }

  if (typeof body === "object") {
    return body;
  }

  let data;

  try {
    data = JSON.parse(body);
  } catch (e) {
    return e;
  }

  this.statusCode = statusCode;
  this.response = data;
  this.message = data.data
    .reduce(function(acc, curr) {
      return (acc += curr.detail + " ");
    }, "")
    .trim();
}

module.exports = Error;
