const API = require("./helpers/API"),
    BasiqUser = require("./services/User");

const Session = function (apiKey, apiVersion) {
    if (!this) {
        return new Session(apiKey);
    }

    apiVersion = apiVersion || "1.0";

    let token = null;

    const self = this;

    this.sessionTimestamp = null;

    this.API = (new API("https://au-api.basiq.io")).setHeader("Authorization", "Basic " + apiKey).setHeader("basiq-version", apiVersion);

    this.expired = function () {
        return Date.now() - self.sessionTimestamp > 1000 * 60 * 60;
    };

    this.getToken = function () {
        if (!self.expired()) {
            return new Promise(function (res) {
                res(true);
            });
        }

        return new Promise(function (res, rej) {
            return self.API.setHeader("Authorization", "Basic " + apiKey).send("oauth2/token", "POST", {
                "grant_type": "client_credentials"
            }).then(function (body) {
                self.sessionTimestamp = Date.now();
                token = body.access_token;
                self.API.setHeader("Authorization", "Bearer " + body.access_token);

                res(true);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.createUser = function (data) {
        return new BasiqUser(self).new(data);
    };

    this.getUser = function (id) {
        return new BasiqUser(self).get(id);
    };

    this.forUser = function (id) {
        return new BasiqUser(self).for(id);
    };

    this.getInstitutons = function () {
        return new Promise(function (res, rej) {
            return self.getToken().then(function () {
                return self.API.send("institutions" , "GET");
            }).then(function (body) {
                res(body);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.getInstituton = function (institutionId) {
        return new Promise(function (res, rej) {
            return self.getToken().then(function () {
                return self.API.send("institutions/" + institutionId , "GET");
            }).then(function (body) {
                res(body);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    return new Promise(function (res, rej) {
        self.getToken().then(function () {
            res(self);
        }).catch(function (err) {
            rej(err);
        });
    });
};

module.exports = Session;