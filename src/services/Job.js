const BasiqConnection = require("./Connection");

const Job = function(data, service) {
  this.id = data.id ? data.id : null;
  this.created = data.created ? data.created : null;
  this.updated = data.updated ? data.updated : null;
  this.steps = data.steps ? data.steps : null;
  this.links = data.links ? data.links : null;

  const self = this;

  /**
   * @type JobService
   */
  this.service = service;

  this.getConnectionId = function() {
    if (!self.links || !self.links.source) {
      return "";
    }

    return self.links.source.substr(self.links.source.lastIndexOf("/") + 1);
  };

  this.refresh = function() {
    return this.service.get(self.id);
  };

  this.getCurrentStep = function() {
    let currentStep = {
      title: "uninitialized"
    };

    for (let step in self.steps) {
      if (!self.steps.hasOwnProperty(step)) {
        continue;
      }

      if (self.steps[step].status === "success") {
        currentStep = self.steps[step];
      }
    }

    return currentStep;
  };

  this.waitForCredentials = function(interval, timeout) {
    return this.service.waitForCredentials(self, interval, timeout);
  };

  this.getConnection = function() {
    return this.service.getConnection(self);
  };

  this.canFetchTransactions = function() {
    return self.service.canFetchTransactions(self);
  };

  this.canFetchAccounts = function() {
    return self.service.canFetchAccounts(self);
  };
};

const JobService = function(session, connectionService) {
  const self = this;

  this.connectionService = connectionService;

  this.get = function(id) {
    if (!id) {
      throw new Error("No job id provided");
    }

    return new Promise(function(res, rej) {
      return session
        .getToken()
        .then(function() {
          return session.API.send("jobs/" + id, "GET");
        })
        .then(function(body) {
          res(new Job(body, self));
        })
        .catch(function(err) {
          rej(err);
        });
    });
  };

  this.for = function(data) {
    if (!data.id) {
      throw new Error("No job id provided");
    }

    return new Job(data, self);
  };

  this.getConnection = async function(job) {
    let connectionId;

    if (job.getConnectionId() === "") {
      const newJob = await self.get(job.id);

      connectionId = newJob.getConnectionId();
    } else {
      connectionId = job.getConnectionId();
    }

    return connectionService.get(connectionId);
  };

  this.waitForCredentials = function(job, interval, timeout) {
    const start = Date.now();

    return new Promise(async function(res, rej) {
      const check = async function(i) {
        if (Date.now() - start > timeout * 1000) {
          return rej({
            timeout: true,
            message: "The operation has timed out"
          });
        }

        job = await job.refresh();

        const credentialsStep = job.steps && job.steps[0];

        if (
          credentialsStep.status &&
          credentialsStep.status !== "in-progress" &&
          credentialsStep.status !== "pending"
        ) {
          if (credentialsStep.status === "success" || credentialsStep.status === "failed") {
            return res(connectionService.get(job.getConnectionId()));
          }

          return res(null);
        }

        setTimeout(check.bind(null, ++i), interval);
      };

      setTimeout(check.bind(null, 0), 0);
    });
  };

  this.canFetchTransactions = async function(job) {
    if (!job.steps) {
      job = await job.refresh();
    }

    return job.getCurrentStep().title === "retrieve-accounts" || job.getCurrentStep().title === "retrieve-transactions";
  };

  this.canFetchAccounts = async function(job) {
    if (!job.steps) {
      job = await job.refresh();
    }

    return job.getCurrentStep().title === "retrieve-accounts" && job.getCurrentStep().status === "success";
  };
};

module.exports = JobService;
