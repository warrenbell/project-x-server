var Gitana = require("gitana");

/* Notes

Currently we are placing the Gitana ticket in a cookie. This means that these connections services will only work for http requests. The ticket will have to be placed in the session
in order for these connection services to work for socket.io requests. Store the gitana ticket in req.session.ticket instead of res.cookie('ticket', ticket, { maxAge: 900000 }); .

Enable sessions by:

1) In /config/http.js un comment out "session" in the middleware stack order array.
2) In /config/session.js un comment out the line "adapter: 'connect-redis',"
3) Make sure you have an instance of redis running somewhere

*/


// Example of err object returned in Gitana.connect(sails.config.gitanaConfig, function(err) {});
/*{
  "statusText": null,
  "status": 500,
  "errorType": "http",
  "response": {
    "text": "{\"message\":\"Unable to find user: 6c12eb79-cda1-41db-abb0-891231b2cbac3\",\"code\":500,\"error\":true,\"reason\":\"Unable to find user: 6c12eb79-cda1-41db-abb0-891231b2cbac3\"}",
    "xml": "",
    "requestHeaders": {
      "Authorization": "Basic NWQ2ZDEyOTAtMWY5Yi00NGZjLTg2NGQtMWI3NDNlNTI4YTU1Om9lYWZQUkJhTjBMVXhYZmNacmUvR2pNTjJnY1crWTdVQXVHa1VJRDFCOGhDS1BRSmhGUXBFaUJzbjdCQmtaNmJBMXBxZFJaSGpkdGFadExMZWFndENiUjlpdWE4RHhFZ2lsUHdjTDduYnJnPQ==",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    "responseHeaders": {
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "x-xsrf-token,cache-control,content-type,x-prototype-version,x-csrf-token,accept,origin,authorization,x-requested-with,pragma",
      "access-control-allow-methods": "POST, GET, OPTIONS, PUT, DELETE",
      "access-control-allow-origin": "*",
      "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
      "content-language": "en-US",
      "content-type": "application/json;charset=UTF-8",
      "date": "Tue, 30 Jun 2015 02:36:02 GMT",
      "expires": "0",
      "pragma": "no-cache, no-cache",
      "server": "Apache-Coyote/1.1",
      "strict-transport-security": "max-age=31536000 ; includeSubDomains",
      "vary": "Accept-Encoding",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "x-xss-protection": "1; mode=block",
      "content-length": "166",
      "connection": "Close"
    }
  },
  "xhr": {
    "UNSENT": 0,
    "OPENED": 1,
    "HEADERS_RECEIVED": 2,
    "LOADING": 3,
    "DONE": 4,
    "readyState": 4,
    "responseText": "{\"message\":\"Unable to find user: 6c12eb79-cda1-41db-abb0-891231b2cbac3\",\"code\":500,\"error\":true,\"reason\":\"Unable to find user: 6c12eb79-cda1-41db-abb0-891231b2cbac3\"}",
    "responseXML": "",
    "status": 500,
    "statusText": null,
    "withCredentials": true,
    "timeout": 120000
  },
  "message": "Unable to find user: 6c12eb79-cda1-41db-abb0-891231b2cbac3",
  "output": "There was a problem connecting to Cloud CMS.  Please try again or contact Cloud CMS for assistance. Message: Unable to find user: 6c12eb79-cda1-41db-abb0-891231b2cbac3"
}

Examples of what object "this" returned in the "callback" function above can do
var platform = this.platform();
var domain = this.datastore("principals");
headers["Authorization"] = this.platform().getDriver().getHttpHeaders()["Authorization"];
var domainId = this.datastore("principals").getId();
var application = this.application();


*/

module.exports = function() {

  /*
    gitanaConfig should look similar to this

    {
      "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
      "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
      "baseURL": "https://api.cloudcms.com",
      "application": "9f923e9ef3e69ccaa64f",
      "ticket": "45c9c3bc-f1d0-4ab7-8ff8-053f6e877bd0"
    }

  */

  var getGitanaConfigWithTicketFromCookie = function(req) {
    var gitanaConfig = getGitanaConfigWithoutUsernameAndPassword();
    gitanaConfig.ticket = req.cookies.ticket;
    return gitanaConfig;
  };

  /*
    gitanaConfig should look similar to this

    {
      "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
      "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
      "username": "6c12eb79-cda1-41db-abb0-891231b2cbac",
      "password": "cT2vrg9T+s8eKpVTC5KWbgUNEoz8/adKnVMQGgURkjx3WXBUTBkVRDlktX5PFWnSFP2g3OTApwo0Mk3kyn4ez6GE4QeiButBO/pxjAmrly0=",
      "baseURL": "https://api.cloudcms.com",
      "application": "9f923e9ef3e69ccaa64f"
    }
  */

  var getGitanaConfigWithUsernamePasswordFromHeaders = function(req, authorizationHeaderName) {

    var username;
    var password;
    var gitanaConfig = getGitanaConfigWithoutUsernameAndPassword();

    if (authorizationHeaderName) {
        var authorizationHeader = req.headers[authorizationHeaderName];
        sails.log.info("authorizationHeader=[" + authorizationHeader + "]");
        if (authorizationHeader) {
            var z = authorizationHeader.indexOf("Basic ");

            if (z === 0) {
                var byte64string = authorizationHeader.substring(6);
                var usernamePasswordSecret = new Buffer(byte64string, 'base64').toString('ascii');

                if (usernamePasswordSecret) {
                    z = usernamePasswordSecret.indexOf(":");

                    if (z > -1) {
                        username = usernamePasswordSecret.substring(0, z);
                        password = usernamePasswordSecret.substring(z+1);
                        sails.log.info("username=" + username);
                        sails.log.info("password=" + password);
                    }
                }
            }
        }
    }
    if(username && username.length > 0 && password && password.length > 0) {
      // This gets rid of any connections associated with the username
      // Gitana.disconnect(gitanaConfig.clientKey + ":" + username, true);
      gitanaConfig.username = username;
      gitanaConfig.password = password;
    }
    return gitanaConfig;
  };

  var getAuthorizationHeaderName = function(req) {
    if(req && req.headers) {

      for (var k in req.headers) {

          if (k.toLowerCase() == "authorization") {
              return k;
          }
      }
    }
    return undefined;
  };

  var getGitanaConfigWithoutUsernameAndPassword = function() {
    var gitanaConfig = {
      clientKey: sails.config.gitanaConfig.clientKey,
      clientSecret: sails.config.gitanaConfig.clientSecret,
      baseURL: sails.config.gitanaConfig.baseURL,
      application: sails.config.gitanaConfig.application,
    };
    return gitanaConfig;
  };

  var getGitanaConfigWithUsernameAndPasswordForGuest = function() {
    var gitanaConfig = getGitanaConfigWithoutUsernameAndPassword();
    gitanaConfig.username = "guest";
    gitanaConfig.password = "guest";
    return gitanaConfig;
  };

  // Connection functions

  var doConnect = function(res, gitanaConfig, callback) {
    //sails.log.info("gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));

    Gitana.connect(gitanaConfig, function(err) {
      // Connection handler
      sails.log.info("gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));

      if(err) {
        err.output = "There was a problem connecting to Cloud CMS. Message: ";

        if (err.message) {
            err.output += err.message;
            sails.log.error(JSON.stringify(err, null, 2));
        }

        sails.log.error("There was an error connecting, gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));
        callback.call(this, err);
      } else {
        sails.log.info("Success getting connection");
        if(res) {
          var ticket = this.getDriver().getAuthInfo().getTicket();
          res.cookie('ticket', ticket, { maxAge: 900000 });
        }
        callback.call(this);
      }
    });
  };

  var doDisconnect = function(res, gitanaConfig, callback) {
    sails.log.info("gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));

    Gitana.connect(gitanaConfig, function(err) {
      // Connection handler function

      if(err) {
        err.output = "There was an error connecting to Cloud CMS with an existing gitana ticket. Message: ";

        if (err.message) {
            err.output += err.message;
            sails.log.error(JSON.stringify(err, null, 2));
        }
        sails.log.error("There was an error connecting, gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));
        callback.call(this, err);
      }
    }).logout(true).then(function() {
      // Connection with ticket succeeded handler function
      sails.log.info("Disconnecting with gitana ticket Succeeded");
      res.clearCookie('ticket');
      callback.call(this);
    });
  };

  // Main Interface

  var r = {};

  /*
    {
        "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
        "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
        "username": "6c12eb79-cda1-41db-abb0-891231b2cbac",
        "password": "cT2vrg9T+s8eKpVTC5KWbgUNEoz8/adKnVMQGgURkjx3WXBUTBkVRDlktX5PFWnSFP2g3OTApwo0Mk3kyn4ez6GE4QeiButBO/pxjAmrly0=",
        "baseURL": "https://api.cloudcms.com",
        "application": "9f923e9ef3e69ccaa64f"
    }
  */

  r.getAppUserConnection = function(callback) {
    sails.log.info('Retrieving Gitana driver for appuser');
    var gitanaConfig = sails.config.gitanaConfig;
    gitanaConfig.key = gitanaConfig.application;
    doConnect(undefined, sails.config.gitanaConfig, callback);
  };

  // 1) Checks for username and password, if yes, tries to authenticate
  // 2) Checks if Gitana ticket is in a cookie, if yes, tries to authenticate
  // 3) Last tries to authenticate as user "guest"

  r.getUserConnection = function(req, res, callback) {
    sails.log.info('Retrieving Gitana driver for user');
    var gitanaConfig;
    var authorizationHeaderName = getAuthorizationHeaderName(req);

    if(authorizationHeaderName) {
      sails.log.info("Getting Connection with username and password");

      gitanaConfig = getGitanaConfigWithUsernamePasswordFromHeaders(req, authorizationHeaderName)

      if(gitanaConfig.username && gitanaConfig.password) {
        gitanaConfig.key = gitanaConfig.clientKey + ":" + gitanaConfig.username + "-" + new Date().getTime();
        doConnect(res, gitanaConfig, callback)
      } else {
        var err = {
          message: "Username and Password were not in the Authorization http headers.",
          output: "GitanaService#getUserConnection could not be completed. Message: Username and Password were not in the Authorization http headers."
        };

        callback(err);
      }
    } else if (req.cookies && req.cookies.ticket) {
      sails.log.info("Getting Connection with gitana ticket");

      gitanaConfig = getGitanaConfigWithTicketFromCookie(req);
      doConnect(res, gitanaConfig, callback);

    } else if (false) {
      sails.log.info("Getting Connection with Guest Account");
    } else {

      var err = {
        message: "No username and password in http Authorization headers and there was no gitana ticket in the user's cookie",
        output: "GitanaService#getUserConnection could not be completed. Message: No username and password in http Authorization headers and there was no gitana ticket in the user's cookie"
      };

      callback(err);
    }
  };

  r.disconnectUserConnection = function(req, res, callback) {
    sails.log.info('Disconnecting Gitana driver for user');

    if (req.cookies && req.cookies.ticket) {
      var gitanaConfig = getGitanaConfigWithTicketFromCookie(req);
      doDisconnect(res, gitanaConfig, callback);
    } else {
      var err = {
        message: "There was no gitana ticket in the user's cookie",
        output: "GitanaService#disconnectUserConnection could not be completed. Message: There was no gitana ticket in the user's cookie"
      };
      callback(err);
    }
  };

  return r;
}();
