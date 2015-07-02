var Gitana = require("gitana");

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

Example of gitanaConfig for appUser connection

{
    "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
    "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
    "username": "6c12eb79-cda1-41db-abb0-891231b2cbac",
    "password": "cT2vrg9T+s8eKpVTC5KWbgUNEoz8/adKnVMQGgURkjx3WXBUTBkVRDlktX5PFWnSFP2g3OTApwo0Mk3kyn4ez6GE4QeiButBO/pxjAmrly0=",
    "baseURL": "https://api.cloudcms.com",
    "application": "9f923e9ef3e69ccaa64f"
}

*/

module.exports = function() {


  /*
    gitanaConfig should look like this

    {
      "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
      "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
      "username": "6c12eb79-cda1-41db-abb0-891231b2cbac",
      "password": "cT2vrg9T+s8eKpVTC5KWbgUNEoz8/adKnVMQGgURkjx3WXBUTBkVRDlktX5PFWnSFP2g3OTApwo0Mk3kyn4ez6GE4QeiButBO/pxjAmrly0=",
      "baseURL": "https://api.cloudcms.com",
      "application": "9f923e9ef3e69ccaa64f"
    }
  */

  var doConnectAppUser = function(gitanaConfig, callback) {
    sails.log.info("gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));

    Gitana.connect(gitanaConfig, function(err) {
      // Connection handler function

      if(err) {
        err.output = "There was a problem connecting to Cloud CMS. Please try again or contact Cloud CMS for assistance. Message: ";

        if (err.message) {
            err.output += err.message;
            sails.log.error(JSON.stringify(err, null, 2));
        }

        callback.call(this, err);
      }
      callback.call(this);
    });
  };

  /*
    gitanaConfig should look like this

    {
      "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
      "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
      "baseURL": "https://api.cloudcms.com",
      "application": "9f923e9ef3e69ccaa64f"
    }

    usernamePasswordSecret should look like this

    {
      "username": "username",
      "password": "password"
    }
  */

  var doConnectWithAuthentication = function(usernamePasswordSecret, gitanaConfig, req, callback) {
    sails.log.info("gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));
    sails.log.info("usernamePasswordSecret=" + JSON.stringify(usernamePasswordSecret, null, 2));

    Gitana.connect(gitanaConfig, function(err) {
      // Connection handler function

      if(err) {
        err.output = "There was a problem connecting to Cloud CMS.  Please try again or contact Cloud CMS for assistance. Message: ";

        if (err.message) {
            err.output += err.message;
            sails.log.error(JSON.stringify(err, null, 2));
        }

        callback.call(this, err);
      }
    }).authenticate(usernamePasswordSecret, function(obj){
      // Authentication failed handler function
      sails.log.error("Login Failed");

      var err = {
        message: "Username or Password is incorrect",
        output: "doConnectWithAuthentication could not be completed. Message: Username or Password is incorrect"
      };

      callback.call(this, err);
    }).then(function() {
      // Authentication succeeded handler function
      sails.log.info("Login Succeeded");

      req.session.accessToken = this.getDriver().http.accessToken();
      callback.call(this);
    });
  };

  /*
    gitanaConfig should look like this

    {
      "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
      "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
      "baseURL": "https://api.cloudcms.com",
      "application": "9f923e9ef3e69ccaa64f",
      "token": "45c9c3bc-f1d0-4ab7-8ff8-053f6e877bd0"
    }

  */

  var doConnectWithAccessToken = function(gitanaConfig, req, callback) {
    sails.log.info("gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));

    Gitana.connect(gitanaConfig, function(err) {
      // Connection handler function

      if(err) {
        err.output = "There was a problem connecting to Cloud CMS with an existing access token.  Please try again or contact Cloud CMS for assistance. Message: ";

        if (err.message) {
            err.output += err.message;
            sails.log.error(JSON.stringify(err, null, 2));
        }
        callback.call(this, err);
      }
    }).then(function() {
      // Connection with access token succeeded handler function
      sails.log.info("Connection with access token Succeeded");

      req.session.accessToken = this.getDriver().http.accessToken();
      callback.call(this);
    });
  };

  /*
    gitanaConfig should look like this

    {
      "clientKey": "5d6d1290-1f9b-44fc-864d-1b743e528a55",
      "clientSecret": "oeafPRBaN0LUxXfcZre/GjMN2gcW+Y7UAuGkUID1B8hCKPQJhFQpEiBsn7BBkZ6bA1pqdRZHjdtaZtLLeagtCbR9iua8DxEgilPwcL7nbrg=",
      "baseURL": "https://api.cloudcms.com",
      "application": "9f923e9ef3e69ccaa64f",
      "token": "45c9c3bc-f1d0-4ab7-8ff8-053f6e877bd0"
    }

  */

  var doDisconnect = function(gitanaConfig, req, callback) {
    sails.log.info("gitanaConfig=" + JSON.stringify(gitanaConfig, null, 2));

    Gitana.connect(gitanaConfig, function(err) {
      // Connection handler function

      if(err) {
        err.output = "There was a problem connecting to Cloud CMS with an existing access token.  Please try again or contact Cloud CMS for assistance. Message: ";

        if (err.message) {
            err.output += err.message;
            sails.log.error(JSON.stringify(err, null, 2));
        }
        callback.call(this, err);
      }
    }).logout().then(function() {
      // Connection with access token succeeded handler function
      sails.log.info("Disconnecting with access token Succeeded");
      req.session.accessToken = undefined;
      callback.call(this);
    });
  };

  var getGitanaConfigWithAccessTokenFromSession = function(req) {
    var gitanaConfig = getGitanaConfigWithoutUsernameAndPassword();
    gitanaConfig.token = req.session.accessToken;
    return gitanaConfig;
  };

  var getUsernamePasswordFromHeaders = function(req, authorizationHeaderName) {

    var username;
    var password;
    var r;

    if (authorizationHeaderName) {
        var authorizationHeader = req.headers[authorizationHeaderName];

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
      r = {
        username: username,
        password: password
      };
    }
    return r;
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

  var r = {};

  r.getAppUserConnection = function(callback) {
    sails.log.info('Retrieving Gitana driver for appuser');
    doConnectAppUser(sails.config.gitanaConfig, callback);
  };

  r.getUserConnection = function(req, callback) {
    sails.log.info('Retrieving Gitana driver for user');
    var gitanaConfig;
    var authorizationHeaderName = getAuthorizationHeaderName(req);

    if(authorizationHeaderName) {
      sails.log.info("Getting Connection with username and password");
      var usernamePasswordSecret = getUsernamePasswordFromHeaders(req, authorizationHeaderName)

      if(usernamePasswordSecret) {

        if(usernamePasswordSecret.username.toLowerCase() ==  "guest") {
          var err = {
            message: "Not allowed to connect to Cloud CMS as guest user",
            output: "GitanaService#getUserConnection could not be completed. Message: Not allowed to connect to Cloud CMS as guest user"
          };

          callback(err);
        } else {
          var gitanaConfig = getGitanaConfigWithoutUsernameAndPassword();

          doConnectWithAuthentication(usernamePasswordSecret, gitanaConfig, req, callback)
        }
      } else {
        var err = {
          message: "Username and Password were not in the Authorization http headers.",
          output: "GitanaService#getUserConnection could not be completed. Message: Username and Password were not in the Authorization http headers."
        };

        callback(err);
      }
    } else if (req.session && req.session.accessToken) {
      sails.log.info("Getting Connection with Access Token");

      gitanaConfig = getGitanaConfigWithAccessTokenFromSession(req);
      doConnectWithAccessToken(gitanaConfig, req, callback);

    } else {

      var err = {
        message: "No username and password in http Authorization headers and there was no access token in the user's session",
        output: "GitanaService#getUserConnection could not be completed. Message: No username and password in http Authorization headers and there was no access token in the user's session"
      };

      callback(err);
    }
  };

  r.disconnectUserConnection = function(req, callback) {
    sails.log.info('Disconnecting Gitana driver for user');

    if (req.session && req.session.accessToken) {
      var gitanaConfig = getGitanaConfigWithAccessTokenFromSession(req);
      doDisconnect(gitanaConfig, req, callback);
    } else {
      var err = {
        message: "There was no access token in the user's session",
        output: "GitanaService#disconnectUserConnection could not be completed. Message: There was no access token in the user's session"
      };
      callback(err);
    }
  };

  return r;
}();
