!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.library=n():t.library=n()}("undefined"!=typeof self?self:this,function(){return function(t){var n={};function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}return e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=4)}([function(t,n,e){const i=e(2),r=function(t,n){this.id=t.id?t.id:null,this.institution=t.institution?t.institution:null,this.accounts=t.accounts?t.accounts:null,this.status=t.status?t.status:null;const e=this;this.service=n,this.update=function(t,n){return e.service.update(e,t,n)},this.refresh=function(){return e.service.refresh(e)},this.delete=function(){return e.service.delete(e)}};t.exports=function(t,n){if(!t)throw new Error("No session provided");if(!n)throw new Error("User not initialized");const e=this;return e.data={job:null},this.new=function(r,o,s,u){if(!o)throw new Error("No user id provided: "+JSON.stringify(arguments));if(!s)throw new Error("No password provided: "+JSON.stringify(arguments));if(!r)throw new Error("No institution id provided: "+JSON.stringify(arguments));const c={loginId:o=o.trim(),password:s=s.trim(),institution:{id:r}};return(u=u&&u.trim())&&u.length>0&&(c.securityCode=u),new Promise(function(r,o){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/connections","POST",c)}).then(function(n){n.id||o(n),r(new i(t,e).for(n))}).catch(function(t){o(t)})})},this.get=function(i){if(!i)throw new Error("No connection id provided: "+JSON.stringify(arguments));return new Promise(function(o,s){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/connections/"+i,"GET")}).then(function(t){t.id||s(t),o(new r(t,e))}).catch(function(t){s(t)})})},this.update=function(r,o){if(!o)throw new Error("No password provided for connection update");if(!r.institution.id)throw new Error("No institution id set for connection");const s={password:o,institution:{id:e.data.institution.id}};return new Promise(function(r,o){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/connections/"+e.data.id,"POST",s)}).then(function(n){n.id||o(n),r(new i(t,e).for(n))}).catch(function(t){o(t)})})},this.delete=function(e){return new Promise(function(i,r){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/connections/"+e.id,"DELETE")}).then(function(){i(!0)}).catch(function(t){r(t)})})},this.refresh=function(r){return new Promise(function(o,s){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/connections/"+r.id+"/refresh","POST")}).then(function(n){n.id||s(n),o(new i(t,e).get(n.id))}).catch(function(t){s(t)})})},this.for=function(t,n){if(!t)throw new Error("No connection id provided");const i={id:t};return n&&(i.institution={id:n}),new r(i,e)},this}},function(t,n,e){const i=e(0),r=e(9),o=e(3),s=function(t,n){this.id=t.id?t.id:null,this.email=t.email?t.email:null,this.mobile=t.mobile?t.mobile:null,this.service=n;const e=this;this.createConnection=function(t,n,i,r){return e.service.createConnection(e,t,n,i,r)},this.update=function(t){return e.service.update(e,t)},this.delete=function(){return e.service.delete(e)},this.refreshAllConnections=function(){return e.service.refreshAllConnections(e)},this.listAllConnections=function(t){return e.service.getAllConnections(e,t)},this.getAccount=function(t){return e.service.getAccount(e,t)},this.getAccounts=function(t){return e.service.getAccounts(e,t)},this.getTransaction=function(t){return e.service.getTransaction(e,t)},this.getTransactions=function(t){return e.service.getTransactions(e,t)}};t.exports=function(t){if(!t)throw new Error("No session provided");const n=this;return this.new=function(e){return new Promise(function(i,r){return e&&(e.email||e.mobile)||r(new Error("No email or phone number provided for user")),t.getToken().then(function(){return t.API.send("users","POST",e)}).then(function(t){i(new s(t,n))}).catch(function(t){r(t)})})},this.get=function(e){return new Promise(function(i,r){return e||r(new Error("No id provided for user")),t.getToken().then(function(){return t.API.send("users/"+e,"GET")}).then(function(t){i(new s(t,n))}).catch(function(t){r(t)})})},this.for=function(t){if(!t)throw new Error("No id provided for user");return new s({id:t},n)},this.update=function(e,i){return new Promise(function(r,o){return e.id||o(new Error("User has not been initialized")),t.getToken().then(function(){return t.API.send("users/"+e.id,"POST",i)}).then(function(t){t.id||o(t),r(new s(t,n))}).catch(function(t){o(t)})})},this.delete=function(n){return new Promise(function(e,i){return n.id||i(new Error("User has not been initialized")),t.getToken().then(function(){return t.API.send("users/"+n.id,"DELETE")}).then(function(){e(!0)}).catch(function(t){i(t)})})},this.createConnection=function(n,e,r,o,s){return new i(t,n).new(e,r,o,s)},this.getAllConnections=function(n,e){return new Promise(function(i,r){let s="users/"+n.id+"/connections";return e&&(e instanceof o||r(new Error("Filter argument must be an instance of FilterBuilder")),s=s+"?"+e.getFilter()),t.getToken().then(function(){return t.API.send(s,"GET")}).then(function(t){i(t)}).catch(function(t){r(t)})})},this.refreshAllConnections=function(n){return new Promise(function(e,i){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/connections/refresh","POST")}).then(function(t){t.data||i("Invalid API response: "+JSON.stringify(t)),e(t.data)}).catch(function(t){i(t)})})},this.getAccounts=function(n,e){return new Promise(function(i,r){return t.getToken().then(function(){let s="users/"+n.id+"/accounts";e&&(e instanceof o||r(new Error("Filter argument must be an instance of FilterBuilder")),s=s+"?"+e.getFilter()),t.API.send(s,"GET").then(function(t){i(t)}).catch(function(t){r(t)})})})},this.getAccount=function(n,e){return new Promise(function(i,r){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/accounts/"+e,"GET")}).then(function(t){i(t)}).catch(function(t){r(t)})})},this.getTransactions=function(n,e){return new Promise(function(i,s){return t.getToken().then(function(){let u="users/"+n.id+"/transactions";e&&(e instanceof o||s(new Error("Filter argument must be an instance of FilterBuilder")),u=u+"?"+e.getFilter()),t.API.send(u,"GET").then(function(n){i(new r(n,t))}).catch(function(t){s(t)})})})},this.getTransaction=function(n,e){return new Promise(function(i,r){return t.getToken().then(function(){return t.API.send("users/"+n.id+"/transactions/"+e,"GET")}).then(function(t){i(t)}).catch(function(t){r(t)})})},n}},function(t,n,e){e(0);const i=function(t,n){this.id=t.id?t.id:null,this.created=t.created?t.created:null,this.updated=t.updated?t.updated:null,this.steps=t.steps?t.steps:null,this.links=t.links?t.links:null;const e=this;this.service=n,this.getConnectionId=function(){return e.links&&e.links.source?e.links.source.substr(e.links.source.lastIndexOf("/")+1):""},this.refresh=function(){return this.service.get(e.id)},this.getCurrentStep=function(){let t={title:"uninitialized"};for(let n in e.steps)e.steps.hasOwnProperty(n)&&"success"===e.steps[n].status&&(t=e.steps[n]);return t},this.waitForCredentials=function(t,n){return this.service.waitForCredentials(e,t,n)},this.getConnection=function(){return this.service.getConnection(e)},this.canFetchTransactions=function(){return e.service.canFetchTransactions(e)},this.canFetchAccounts=function(){return e.service.canFetchAccounts(e)}};t.exports=function(t,n){const e=this;this.connectionService=n,this.get=function(n){if(!n)throw new Error("No job id provided");return new Promise(function(r,o){return t.getToken().then(function(){return t.API.send("jobs/"+n,"GET")}).then(function(t){r(new i(t,e))}).catch(function(t){o(t)})})},this.for=function(t){if(!t.id)throw new Error("No job id provided");return new i(t,e)},this.getConnection=async function(t){let i;return i=""===t.getConnectionId()?(await e.get(t.id)).getConnectionId():t.getConnectionId(),n.get(i)},this.waitForCredentials=function(t,e,i){const r=Date.now();return new Promise(async function(o,s){const u=async function(c){if(Date.now()-r>1e3*i)return s({timeout:!0,message:"The operation has timed out"});const f=(t=await t.refresh()).steps&&t.steps[0];if(f.status&&"in-progress"!==f.status&&"pending"!==f.status)return"success"===f.status||"failed"===f.status?o(n.get(t.getConnectionId())):o(null);setTimeout(u.bind(null,++c),e)};setTimeout(u.bind(null,0),0)})},this.canFetchTransactions=async function(t){return t.steps||(t=await t.refresh()),"retrieve-accounts"===t.getCurrentStep().title||"retrieve-transactions"===t.getCurrentStep().title},this.canFetchAccounts=async function(t){return t.steps||(t=await t.refresh()),"retrieve-accounts"===t.getCurrentStep().title&&"success"===t.getCurrentStep().status}}},function(t,n){t.exports=function t(n){if(!this)return new t(n);this.filters=n||[];const e=this;return this.eq=function(t,n){return e.filters.push(t+".eq('"+n+"')"),e},this.gt=function(t,n){return e.filters.push(t+".gt('"+n+"')"),e},this.gteq=function(t,n){return e.filters.push(t+".gteq('"+n+"')"),e},this.lt=function(t,n){return e.filters.push(t+".lt('"+n+"')"),e},this.lteq=function(t,n){return e.filters.push(t+".lteq('"+n+"')"),e},this.bt=function(t,n,i){return e.filters.push(t+".bt('"+n+"','"+i+"')"),e},this.toString=function(){return e.filters.join(",")},this.getFilter=function(){return"filter="+e.filters.join(",")},this.setFilter=function(t){return e.filters=t,e},this}},function(t,n,e){t.exports={Session:e(5),User:e(1),Connection:e(0),Job:e(2),FilterBuilder:e(3)}},function(t,n,e){const i=e(6),r=e(1),o=function(t,n){if(!this)return new o(t,n);n=n||"1.0";let e=null;const s=this;return this.sessionTimestamp=null,this.API=new i("https://au-api.basiq.io").setHeader("Authorization","Basic "+t).setHeader("basiq-version",n),this.expired=function(){return Date.now()-s.sessionTimestamp>36e5},this.getToken=function(){return s.expired()?new Promise(function(n,i){return s.API.setHeader("Authorization","Basic "+t).send("oauth2/token","POST",{grant_type:"client_credentials"}).then(function(t){s.sessionTimestamp=Date.now(),e=t.access_token,s.API.setHeader("Authorization","Bearer "+t.access_token),n(!0)}).catch(function(t){i(t)})}):new Promise(function(t){t(!0)})},this.createUser=function(t){return new r(s).new(t)},this.getUser=function(t){return new r(s).get(t)},this.forUser=function(t){return new r(s).for(t)},this.getInstitutions=function(){return new Promise(function(t,n){return s.getToken().then(function(){return s.API.send("institutions","GET")}).then(function(n){t(n)}).catch(function(t){n(t)})})},this.getInstitution=function(t){return new Promise(function(n,e){return s.getToken().then(function(){return s.API.send("institutions/"+t,"GET")}).then(function(t){n(t)}).catch(function(t){e(t)})})},new Promise(function(t,n){s.getToken().then(function(){t(s)}).catch(function(t){n(t)})})};t.exports=o},function(t,n,e){const i=e(7),r=e(8),o=function(t){return this.options={host:t,headers:{"Content-Type":"application/json"}},this};o.prototype.setHeader=function(t,n){return this.options.headers[t]=n,this},o.prototype.send=function(t,n,e){const o={};return o.uri=this.options.host+"/"+t,o.method=n.toUpperCase(),o.headers=function(t){if(null===t||"object"!=typeof t)return t;const n=t.constructor();for(let e in t)t.hasOwnProperty(e)&&(n[e]=t[e]);return n}(this.options.headers),e&&(o.body=JSON.stringify(e),o.headers["Content-Length"]=o.body.length),new Promise(function(t,n){i(o,function(e,i,o){if(e||i.statusCode>299)return n(e||new r(o,i.statusCode));try{t(JSON.parse(o))}catch(n){t(null)}})})},t.exports=o},function(t,n){t.exports=require("request")},function(t,n){t.exports=function t(n,e){if(void 0===this)return new t(n,e);if("object"==typeof n)return n;let i;try{i=JSON.parse(n)}catch(t){return t}this.statusCode=e,this.response=i,this.message=i.data.reduce(function(t,n){return t+(n.detail+" ")},"").trim()}},function(t,n){t.exports=function(t,n){this.data=t.data,this.links=t.links,this.session=n;const e=this;return this.next=function(){if(!e.links||!e.links.next)return!1;const t=e.links.next.substr(e.links.next.indexOf(".io/")+4);return new Promise(function(i,r){return n.getToken().then(function(){return n.API.send(t,"GET")}).then(function(t){if(t.data&&0===t.data.length)return i(!1);e.data=t.data,e.links=t.links,i(!0)}).catch(function(t){r(t)})})},this}}])});