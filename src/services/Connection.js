const BasiqJob = require("./Job");

const Connection = function(data, service) {
  this.id = data.id ? data.id : null;
  this.institution = data.institution ? data.institution : null;
  this.accounts = data.accounts ? data.accounts : null;
  this.status = data.status ? data.status : null;

  const self = this;

  /**
   * @type ConnectionService
   */
  this.service = service;

  this.update = function(password, securityCode, secondaryLoginId) {
    return self.service.update(self, password, securityCode, secondaryLoginId);
  };

  this.refresh = function() {
    return self.service.refresh(self);
  };

  this.delete = function() {
    return self.service.delete(self);
  };
};

const ConnectionService = function(session, user) {
  if (!session) {
    throw new Error("No session provided");
  }

  if (!user) {
    throw new Error("User not initialized");
  }

  const self = this;

  self.data = {
    job: null
  };

  this.new = function(institutionId, loginId, password, securityCode, secondaryLogin) {
    if (!loginId) {
      throw new Error("No user id provided: " + JSON.stringify(arguments));
    }
    if (!password) {
      throw new Error("No password provided: " + JSON.stringify(arguments));
    }
    if (!institutionId) {
      throw new Error("No institution id provided: " + JSON.stringify(arguments));
    }

    loginId = loginId.trim();
    password = password.trim();
    securityCode = securityCode && securityCode.trim();
    secondaryLoginId = secondaryLoginId && secondaryLoginId.trim();

    const payload = {
      loginId: loginId,
      password: password,
      institution: {
        id: institutionId
      }
    };

    if (securityCode && securityCode.length > 0) {
      payload["securityCode"] = securityCode;
    }

    if (secondaryLoginId && secondaryLoginId.length > 0) {
      payload["secondaryLoginId"] = secondaryLoginId;
    }

    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/connections", "POST", payload);
        })
        .then(function(body) {
          if (!body.id) {
            rej(body);
          }
          res(new BasiqJob(session, self).for(body));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.get = function(id) {
    if (!id) {
      throw new Error("No connection id provided: " + JSON.stringify(arguments));
    }

    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/connections/" + id, "GET");
        })
        .then(function(body) {
          if (!body.id) {
            rej(body);
          }

          res(new Connection(body, self));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.update = function(connection, password, securityCode, secondaryLoginId) {
    if (!password) {
      throw new Error("No password provided for connection update");
    }

    if (!connection.institution.id) {
      throw new Error("No institution id set for connection");
    }

    const payload = {
      password: password,
      institution: {
        id: connection.institution.id
      }
    };

    if (securityCode && securityCode.length > 0) {
      payload["securityCode"] = securityCode;
    }

    if (secondaryLoginId && secondaryLoginId.length > 0) {
      payload["secondaryLoginId"] = secondaryLoginId;
    }

    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/connections/" + connection.id, "POST", payload);
        })
        .then(function(body) {
          if (!body || !body.id) {
            rej(body);
          }

          res(new BasiqJob(session, self).for(body));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.delete = function(connection) {
    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/connections/" + connection.id, "DELETE");
        })
        .then(function() {
          res(true);
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.refresh = function(connection) {
    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/connections/" + connection.id + "/refresh", "POST");
        })
        .then(function(body) {
          if (!body.id) {
            rej(body);
          }

          res(new BasiqJob(session, self).get(body.id));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.for = function(id, institutionId) {
    if (!id) {
      throw new Error("No connection id provided");
    }

    const data = { id: id };

    if (institutionId) {
      data.institution = {
        id: institutionId
      };
    }

    return new Connection(data, self);
  };

  return this;
};

module.exports = ConnectionService;
