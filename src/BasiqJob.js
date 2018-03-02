const Job = function (session) {

    const self = this;

    this.data = {
        id: null,
        created: null,
        updated: null,
        steps: null,
        links: null
    };

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
        return self.data.links.source.substr(self.data.links.source.lastIndexOf("/") + 1);
    };
};

module.exports = Job;
