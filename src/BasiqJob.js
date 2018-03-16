const BasiqConnection = require("./BasiqConnection");

const Job = function (session, connection) {

    const self = this;

    this.data = {
        id: null,
        created: null,
        updated: null,
        steps: null,
        links: null
    };
    
    this.connection = connection;

    this.get = function (id) {
        if (!id) {
            throw new Error("No job id provided");
        }

        return new Promise(function (res, rej) {
            return session.getToken().then(function () {
                return session.API.send("jobs/" + id, "GET");
            }).then(function (body) {
                self.data = body;

                res(self);
            }).catch(function(err) {
                rej(err);
            });
        });
    };

    this.refreshJobData = function () {
        if (!self.data.id) {
            throw new Error("Job is not initialized");
        }

        return this.get(self.data.id);
    };

    this.getCurrentStep = function () {
        let currentStep = {
            title: "uninitialized"
        };

        for (let step in self.data.steps) {
            if (!self.data.steps.hasOwnProperty(step)) {
                continue;
            }

            if (self.data.steps[step].status === "success") {
                currentStep = self.data.steps[step];
            }
        }

        return currentStep;
    };

    this.getConnectionId = function () {
        if (!self.data.links || !self.data.links.source) {
            return "";
        }

        return self.data.links.source.substr(self.data.links.source.lastIndexOf("/") + 1);
    };

    this.getConnection = async function () {
        let connectionId;

        if (self.getConnectionId() === "") {
            const job = await this.get(self.id);

            connectionId = job.getConnectionId();
        } else {
            connectionId = self.getConnectionId();
        }
        
        return connection.get(connectionId);
    };

    this.waitForCredentials = function (interval, timeout) {
        let job;
        const start = Date.now();

        return new Promise(async function (res, rej) {
            const check = async function (i) {
                if (Date.now() - start > timeout * 1000) {
                    return rej({
                        error: true,
                        errorMessage: "The operation has timed out"
                    });
                }
                if (i > 0) {
                    job = await self.refreshJobData();
                } else {
                    job = self;
                }
                const credentialsStep = job.data.steps && job.data.steps[0];

                if (credentialsStep.status && credentialsStep.status !== "in-progress" && credentialsStep.status !== "pending") {
                    if (credentialsStep.status === "success") {
                        return res(connection.get(self.getConnectionId()));
                    }

                    return res(null);
                }

                setTimeout(check.bind(null, ++i), interval);
            };

            setTimeout(check.bind(null, 0), 0);
        });
    };
};

module.exports = Job;
