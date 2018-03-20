const BasiqJob = require("./BasiqJob");

const Connection = function (session, user) {
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

    this.new = function (institutionId, loginId, password, securityCode) {
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

        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + user.data.id + "/connections", "POST", payload);
            }).then(function (body) {
                if (!body.id) {
                    rej(body);
                }
                (new BasiqJob(session, self)).get(body.id).then(function (job) {
                    res(job);
                });
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.get = function (id) {
        if (!id) {
            throw new Error("No connection id provided: " + JSON.stringify(arguments));
        }

        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + user.data.id + "/connections/" + id, "GET");
            }).then(function (body) {
                if (!body.id) {
                    rej(body);
                }

                self.data = body;
                res(self);
            }).catch(function (err) {
                rej(err);
            });
        });
    };


    this.update = function (password, securityCode) {
        if (!password) {
            throw new Error("No password provided for connection update");
        }

        if (!self.institution.id) {
            throw new Error("No institution id set for connection");
        }

        const payload = {
            password: password,
            institution: {
                id: self.data.institution.id
            }
        };

        if (securityCode && securityCode.length > 0) {
            payload["securityCode"] = securityCode;
        }

        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + user.data.id + "/connections/" + self.data.id, "POST", payload);
            }).then(function (body) {
                if (!body.id) {
                    rej(body);
                }

                self.data = body;
                res(self);
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.delete = function () {
        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + user.data.id + "/connections/" + self.data.id, "DELETE");
            }).then(function () {
                res(null);
            }).catch(function (err) {
                rej(err);
            });
        });
    };
    
    this.refresh = function () {
        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("users/" + user.data.id + "/connections/" + self.data.id + "/refresh", "POST");
            }).then(function (body) {
                if (!body.id) {
                    rej(body);
                }
                (new BasiqJob(session, self)).get(body.id).then(function (job) {

                    self.data.job = job;
                    self.data.id = job.getConnectionId();

                    res(self);
                });
            }).catch(function (err) {
                rej(err);
            });
        });
    };

    this.for = function (id, institutionId) {
        if (!id) {
            throw new Error("No connection id provided");
        }

        self.data.id = id;

        if (institutionId) {
            self.data.institution = {
                id: institutionId
            };
        }

        return self;
    };

    this.getJobStatus = function () {
        if (!self.data.job) {
            throw new Error("Job is not initialized");
        }

        return self.data.job.refreshJobData();
    };

    this.canFetchTransactions = async function (reload) {
        if (!self.data.job) {
            throw new Error("Job is not initialized");
        }

        let job;

        if (reload) {
            job = await self.data.job.refreshJobData();
        } else {
            job = self.data.job;
        }

        return job.getCurrentStep().title === "retrieve-accounts" || job.getCurrentStep().title === "retrieve-transactions";
    };

    this.canFetchAccounts = async function (reload) {
        if (!self.data.job) {
            throw new Error("Job is not initialized");
        }

        let job;

        if (reload) {
            job = await self.data.job.refreshJobData();
        } else {
            job = self.data.job;
        }

        return job.getCurrentStep().title === "retrieve-accounts" && job.getCurrentStep().status === "success";
    };

    return this;
};

module.exports = Connection;