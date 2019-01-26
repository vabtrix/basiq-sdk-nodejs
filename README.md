# Basiq.io Node.js SDK

This is the documentation for the Node.js SDK for Basiq.io API

## Introduction

To view the API docs, [click here](https://basiq.io/api/).

The SDK is organized to mirror the HTTP API's functionality and hierarchy.
The top level object needed for SDKs functionality is the Session object which requires your API key and may require API version to be instantiated.
You can create a new API key on the [dashboard](http://dashboard.basiq.io).

## Changelog

1.1.0 - Addeed secondaryLoginId parameter to connection API

1.0.1 - Documentation updated

1.0.0 - SDK updated to version 2.0

0.9.0beta - Initial release

## Getting started

Install the SDK using:

```bash
npm i -s basiq-sdk-nodejs
```

Import the package:
```js
const BasiqSDK = require("basiq-sdk-nodejs");
```


## Common usage examples

### Fetching a list of institutions

```js
const BasiqSDK = require("basiq-sdk-nodejs");

(async function() {
        const session = await BasiqSDK.Session("YOUR_API_KEY");

        const institutions = await session.getInstitutions();
})();
```

You can specify the version of API when instantiating Session object. When the version is not specified, default version is 1.0.

```js
const BasiqSDK = require("basiq-sdk-nodejs");

(async function() {
        const session = await BasiqSDK.Session("YOUR_API_KEY", "2.0");

        const institutions = await session.getInstitutions();
})();
```

### Creating a new connection

```js
const BasiqSDK = require("basiq-sdk-nodejs");

(async function() {
        const session = await BasiqSDK.Session("YOUR_API_KEY");

        const user = session.forUser(userId)

        const job = await user.createConnection(institutionId, loginId, password[, securityCode, secondaryLoginId]);

        const connection = await job.waitForCredentials(1000, 60);
})();
```

### Fetching and iterating through transactions

```js
const BasiqSDK = require("basiq-sdk-nodejs"),
    FilterBuilder = BasiqSDK.FilterBuilder;

(async function() {
        const session = await BasiqSDK.Session("YOUR_API_KEY");

        const user = session.forUser(userId);

        try {
                const fb = new FilterBuilder();
                fb.eq("connection.id", connId);
                const transactions = await user.getTransactions(fb);

                while (await transactions.next()) {
                        console.log("Number of records: ", transactions.data.length);
                }
        } catch (e) {
                console.error(typeof e, e);
        }
})();
```


## API

The API of the SDK is manipulated using Services and Entities. Different
services return different entities, but the mapping is not one to one. All
http functions return promises. In case of a failed http resolution the promise
rejection will return an error object.

### Errors

If an action encounters an error, you will receive an APIError instance.
The object contains all available data which you can use to act accordingly.

##### APIError properties
```js
Error.statusCode
Error.response
Error.message
```

Check the [docs](https://basiq.io/api/) for more information about relevant
fields in the error object.

### Filtering

Some of the methods support adding filters to them. The filters are created
using the FilterBuilder function. After instantiating the object, you can invoke
methods in the form of comparison(field, value).

Example:
```js
const fb = new FilterBuilder();
fb.eq("connection.id", "conn-id-213-id").gt("transaction.date", "2018-01-01");
const transactions = user.getTransactions(fb)
```

This example filter for transactions will match all transactions for the connection
with the id of "conn-id-213-id" and that are newer than "2018-01-01". All you have
to do is pass the filter to the method when you want to use it.

<details>
<summary>
Services
</summary>

#### Session

##### Creating a new Session object
(possible API versions: "1.0" and "2.0", default version: "1.0")

```js
const session = await BasiqSDK.Session("YOUR_API_KEY");
```

```js
const session = await BasiqSDK.Session("YOUR_API_KEY", "API_VERSION");
```

#### UserService

The following are APIs available for the User service

##### Creating a new UserService

```js
const userService = BasiqSDK.User(session);
```

##### Referencing a user
*Note: The following action will not send an HTTP request, and can be used
to perform additional actions for the instantiated user.*

```js
const user = userService.for(userId);
```

##### Creating a new User

```js
const user = await userService.new({
        email: "",
        mobile: ""
})
```

##### Getting a User

```js
const user = await userService.get(userId);
```

##### Update a User

```js
const user = await userService.update(user, {
    email: "",
    mobile: ""
});
```

##### Delete a User

```js
const result = await userService.delete(user);
```

##### Refresh connections

```js
const result = await userService.refreshAllConnections(user);
```

##### List all connections

```js
const conns = await userService.getAllConnections(userId, filter);
```

##### Get account

```js
const acc = await userService.getAccount(userId, accountId);
```

##### Get accounts

```js
const accs = await userService.getAccounts(userId, filter);
```

##### Get transaction

```js
const transaction = await userService.getTransaction(userId, transactionId)
```

##### Get transactions

```js
const transactions = await userService.getTransactions(userId, filter)
```

#### ConnectionService

The following are APIs available for the Connection service

##### Creating a new ConnectionService

```js
const connService = new BasiqSDK.Connection(session, user);
```

##### Get connection

```js
const connection = await connService.get(connectionId)
```

##### Get connection entity with ID without performing an http request

```js
const connection = connService.for(connection)
```

##### Create a new connection

```js
const job = await connService.new(institutionId, loginId, password[, securityCode, secondaryLoginId])
```

##### Update connection

```js
const job = await connService.update(connection, password[, securityCode, secondaryLoginId]);
```

##### Delete connection

```js
const result = await connService.delete(connection);
```



#### JobService

The following are APIs available for the Job service

##### Creating a new JobService

```js
jobService = new BasiqSDK.Job(session, connectionService)
```

##### Get a job

```js
const job = await jobService.get(jobId);
```

##### Get a job entity with ID without performing an http request

```js
const job = jobService.for(jobId);
```

##### Get the related connection for the job

```js
const connection = await jobService.getConnection(job);
```

##### Wait for the credential step to be resolved
(interval is in milliseconds, timeout is in seconds)

```js
const connection = await jobService.waitForCredentials(job, interval, timeout);
```

</details>


<details><summary>
Entities
</summary>

##### Updating a user instance

```js
const user = await user.Update({
        email: "",
        mobile: ""
});
```

##### Deleting a user

```js
const result = await user.delete();
```

##### Get all of the user's accounts

```js
const accounts = await user.getAccounts();
```

##### Get a user's single account

```js
const account = await user.getAccount(accountId);
```

##### Get all of the user's transactions

```js
transactions = await user.getTransactions();
```

##### Get a user's single transaction

```js
transaction = await user.getTransaction(transactionId);
```

##### Create a new connection

```js
job = await user.createConnection();
```

##### Refresh all connections

```js
result = await user.refreshAllConnections();
```

#### Connection

##### Refresh a connection

```js
job = await connection.refresh();
```

##### Update a connection

```js
job = await connection.update(password[, securityCode, secondaryLoginId]);
```

##### Delete a connection

```js
err = await connection.delete();
```

#### Job

##### Get the connection id (if available)

```js
connectionId = job.getConnectionId();
```

##### Get the connection

```js
connection = await job.getConnection();
```

##### Get the connection after waiting for credentials step resolution
(interval is in milliseconds, timeout is in seconds)

```js
connection = await job.waitForCredentials(interval, timeout);
```

##### Get the connection after waiting for transactions step resolution
(interval is in milliseconds, timeout is in seconds)

```js
connection = await job.waitForTransactions(interval, timeout);
```

#### Transaction list

##### Getting the next set of transactions [mut]

```js
await transactions.next();
```
</details>
