const BasiqConnection = require("./Connection"),
  TransactionList = require("./TransactionList"),
  FilterBuilder = require("../helpers/FilterBuilder");

const User = function(data, service) {
  this.id = data.id ? data.id : null;
  this.email = data.email ? data.email : null;
  this.mobile = data.mobile ? data.mobile : null;

  /**
   * @type UserService
   */
  this.service = service;

  const self = this;

  this.createConnection = function(institutionId, loginId, password, securityCode, secondaryLoginId) {
    return self.service.createConnection(self, institutionId, loginId, password, securityCode, secondaryLoginId);
  };

  this.update = function(data) {
    return self.service.update(self, data);
  };

  this.delete = function() {
    return self.service.delete(self);
  };

  this.refreshAllConnections = function() {
    return self.service.refreshAllConnections(self);
  };

  this.listAllConnections = function(filter) {
    return self.service.getAllConnections(self, filter);
  };

  this.getAccount = function(accountId) {
    return self.service.getAccount(self, accountId);
  };

  this.getAccounts = function(filter) {
    return self.service.getAccounts(self, filter);
  };

  this.getTransaction = function(transactionId) {
    return self.service.getTransaction(self, transactionId);
  };

  this.getTransactions = function(filter) {
    return self.service.getTransactions(self, filter);
  };
};

const UserService = function(session) {
  if (!session) {
    throw new Error("No session provided");
  }

  const self = this;

  this.new = function(data) {
    return new Promise(function(res, rej) {
      if (!data || (!data.email && !data.mobile)) {
        rej(new Error("No email or phone number provided for user"));
      }

      return session
        .getToken()
        .then(function() {
          return session.API.send("users", "POST", data);
        })
        .then(function(body) {
          res(new User(body, self));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.get = function(id) {
    return new Promise(function(res, rej) {
      if (!id) {
        rej(new Error("No id provided for user"));
      }

      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + id, "GET");
        })
        .then(function(body) {
          res(new User(body, self));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.for = function(id) {
    if (!id) {
      throw new Error("No id provided for user");
    }

    return new User({ id: id }, self);
  };

  this.update = function(user, data) {
    return new Promise(function(res, rej) {
      if (!user.id) {
        rej(new Error("User has not been initialized"));
      }

      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id, "POST", data);
        })
        .then(function(body) {
          if (!body.id) {
            rej(body);
          }
          res(new User(body, self));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.delete = function(user) {
    return new Promise(function(res, rej) {
      if (!user.id) {
        rej(new Error("User has not been initialized"));
      }

      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id, "DELETE");
        })
        .then(function() {
          res(true);
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.createConnection = function(user, institutionId, loginId, password, securityCode, secondaryLoginId) {
    return new BasiqConnection(session, user).new(institutionId, loginId, password, securityCode, secondaryLoginId);
  };

  this.getAllConnections = function(user, filter) {
    return new Promise(function(res, rej) {
      let url = "users/" + user.id + "/connections";
      if (filter) {
        if (!(filter instanceof FilterBuilder)) {
          rej(new Error("Filter argument must be an instance of FilterBuilder"));
        }

        url = url + "?" + filter.getFilter();
      }

      return session
        .getToken()
        .then(function() {
          return session.API.send(url, "GET");
        })
        .then(function(body) {
          res(body);
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.refreshAllConnections = function(user) {
    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/connections/refresh", "POST");
        })
        .then(function(body) {
          if (!body.data) {
            rej("Invalid API response: " + JSON.stringify(body));
          }

          res(body.data);
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.getAccounts = function(user, filter) {
    return new Promise(function(res, rej) {
      return session.getToken().then(function() {
        let url = "users/" + user.id + "/accounts";

        if (filter) {
          if (!(filter instanceof FilterBuilder)) {
            rej(new Error("Filter argument must be an instance of FilterBuilder"));
          }

          url = url + "?" + filter.getFilter();
        }

        session.API.send(url, "GET")
          .then(function(body) {
            res(body);
          })
          .catch(function(err) {
            rej(err);
          });
      });
    });
  };

  this.getAccount = function(user, accountId) {
    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/accounts/" + accountId, "GET");
        })
        .then(function(body) {
          res(body);
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.getTransactions = function(user, filter) {
    return new Promise(function(res, rej) {
      return session.getToken().then(function() {
        let url = "users/" + user.id + "/transactions";

        if (filter) {
          if (!(filter instanceof FilterBuilder)) {
            rej(new Error("Filter argument must be an instance of FilterBuilder"));
          }

          url = url + "?" + filter.getFilter();
        }

        session.API.send(url, "GET")
          .then(function(body) {
            res(new TransactionList(body, session));
          })
          .catch(function(err) {
            rej(err);
          });
      });
    });
  };

  this.getTransaction = function(user, transactionId) {
    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("users/" + user.id + "/transactions/" + transactionId, "GET");
        })
        .then(function(body) {
          res(body);
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  return self;
};

module.exports = UserService;
