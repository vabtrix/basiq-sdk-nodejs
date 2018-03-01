const BasiqConnection = require("./BasiqConnection");

const BasiqUser = function (session) {
    if (!session) {
        throw new Error("No session provided");
    }

    const self = this;

    this.data = {
        id: null,
        email: null,
        mobile: null
    };

    this.new = function (data) {
        if (data && !data.email && !data.mobile) {
            throw new Error("No email or phone number provided for user");
        }


        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                session.API.send("users", "POST", data).then(function (body) {
                    self.data.id = body.id;
                    self.data.email = body.email;
                    self.data.mobile = body.mobile;

                    res(self);
                }).catch(function (err) {
                    rej(err);
                });
            });
        });
    };

    this.get = function (id) {
        if (!id) {
            throw new Error("No id provided for user");
        }


        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                session.API.send("users/" + id, "GET").then(function (body) {
                    self.data = body;

                    res(self);
                }).catch(function (err) {
                    rej(err);
                });
            });
        });
    };

    this.for = function (id) {
        if (!id) {
            throw new Error("No id provided for user");
        }

        self.data.id = id;

        return self;
    };

    this.update = function (data) {
        if (!self.data.id) {
            throw new Error("User has not been initialized");
        }

        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + self.data.id, "POST", data);
            }).then(function (body) {
                if (!body.id) {
                    rej("Invalid API response: " + JSON.stringify(body));
                }
                self.data.id = body.id;
                self.data.email = body.email;
                self.data.mobile = body.mobile;

                res(self);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.delete = function () {
        if (!self.data.id) {
            throw new Error("User has not been initialized");
        }

        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + self.data.id, "DELETE");
            }).then(function () {
                res(true);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.createConnection = function (institutionId, loginId, password, securityCode) {
        return new BasiqConnection(session, self).new(institutionId, loginId, password, securityCode);
    };

    this.getConnection = function (id) {
        return new BasiqConnection(session, self).get(id);
    };

    this.getAllConnections = function () {
        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + self.data.id + "/connections", "GET");
            }).then(function (body) {
                if (!body.id) {
                    rej("Invalid API response: " + JSON.stringify(body));
                }

                res(body);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.refreshConnections = function () {
        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + self.data.id + "/connections/refresh", "POST");
            }).then(function (body) {
                if (!body.data) {
                    rej("Invalid API response: " + JSON.stringify(body));
                }

                res(body.data);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.fetchAccounts = function (connectionId) {
        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                let url = "users/" + self.data.id + "/accounts";

                if (connectionId) {
                    url += "?filter=connection.id.eq('" + connectionId + "')";
                }

                session.API.send(url , "GET").then(function (body) {
                    res(body);
                }).catch(function (err) {
                    rej(err);
                });
            });
        });
    };

    this.fetchTransactions = function (connectionId) {
        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                let url = "users/" + self.data.id + "/transactions";

                if (connectionId) {
                    url += "?filter=connection.id.eq('" + connectionId + "')";
                }

                session.API.send(url , "GET").then(function (body) {
                    res(body);
                }).catch(function (err) {
                    rej(err);
                });
            });
        });
    };

    return self;
};

module.exports = BasiqUser;