var httpProxy = require('http-proxy');
var http = require('http');
var ForeverAgent = require('../../utils/forever-agent/index');
var oauth2 = require("../../utils/oauth2")();
var util = require('../../utils/util');

module.exports = function()
{

  ////////////////////////////////////////////////////////////////////////////
  //
  // HTTP/HTTPS Proxy Server to Cloud CMS
  // Facilitates Cross-Domain communication between Browser and Cloud Server
  // This must appear at the top of the app.js file (ahead of config) for things to work
  //
  ////////////////////////////////////////////////////////////////////////////
  // START PROXY SERVER

  var initialize = function() {
      var proxyScheme = sails.config.proxy.scheme;
      var proxyHost = sails.config.proxy.host;
      var proxyPort = parseInt(sails.config.proxy.port, 10);

      var target = proxyScheme + "://" + proxyHost + ":" + proxyPort;
      var proxyConfig = {
          "target": target,
          "agent": false,
          "xfwd": true
      };

      if (proxyScheme.toLowerCase() === "https") {
          proxyConfig.agent = new ForeverAgent.SSL({
              //maxSockets: 500,
              //maxFreeSockets: 100,
              keepAlive: true,
              keepAliveMsecs: 1000 * 60 * 5
          });
      } else if (proxyScheme.toLowerCase() === "http") {
          proxyConfig.agent = new ForeverAgent({
              //maxSockets: 500,
              //maxFreeSockets: 100,
              keepAlive: true,
              keepAliveMsecs: 1000 * 60 * 5
          });
      }

      proxyConfig.keepAlive = true;
      proxyConfig.keepAliveMsecs = 1000 * 60 * 5;

      var proxyServer = new httpProxy.createProxyServer(proxyConfig);

      // error handling
      proxyServer.on("error", function(err, req, res) {
          console.log(err);
          res.writeHead(500, {
              'Content-Type': 'text/plain'
          });
          res.end('Something went wrong while proxying the request.');
      });

      /*
      // debug: buffer response
      proxyServer.on('proxyRes', function (proxyRes, req, res) {
          var chunks = [];
          // triggers on data receive
          proxyRes.on('data', function receiveChunks(chunk) {
              // add received chunk to chunks array
              chunks.push(chunk);
          });

          // triggers on data end
          proxyRes.on('end', function proxyResponseEnd() {
              // make string from buffer
              var buffer = Buffer.concat(chunks);
              // output buffer
              console.log("Proxy Response -> " + buffer.toString());
          });
      });
      */

      var proxyHandlerServer = http.createServer(function(req, res) {
        // used to auto-assign the client header for /oauth/token requests
        oauth2.autoProxy(req);

        var updateSetCookieValue = function(value) {

          // req.domainHost is set in middleware/host/host.js
          var newDomain = req.domainHost;

          //
          // if the incoming request is coming off of a CNAME entry that is maintained elsewhere (and they're just
          // forwarding the CNAME request to our machine), then we try to detect this...
          //
          // our algorithm here is pretty weak but suffices for the moment.
          // if the req.headers["x-forwarded-host"] first entry is in the req.headers["referer"] then we consider
          // things to have been CNAME forwarded
          // and so we write cookies back to the req.headers["x-forwarded-host"] first entry domain
          //

          var xForwardedHost = req.headers["x-forwarded-host"];
          if (xForwardedHost) {
              xForwardedHost = xForwardedHost.split(",");
              if (xForwardedHost.length > 0) {
                  var cnameCandidate = xForwardedHost[0];

                  var referer = req.headers["referer"];
                  if (referer && referer.indexOf("://" + cnameCandidate) > -1) {
                      sails.log.info("Detected CNAME: " + cnameCandidate);
                      newDomain = cnameCandidate;
                  }
              }
          }

          // allow forced cookie domains
          var forcedCookieDomain = req.headers["cloudcmscookiedomain"];
          if (forcedCookieDomain) {
              newDomain = forcedCookieDomain;
          }

          // now proceed

          // replace the domain with the host
          var i = value.indexOf("Domain=");
          if (i > -1) {
              var j = value.indexOf(";", i);
              if (j > -1) {
                  value = value.substring(0, i+7) + newDomain + value.substring(j);
              } else {
                  value = value.substring(0, i+7) + newDomain;
              }
          }

          // if the originating request isn't secure, strip out "secure" from cookie
          if (!req.secure) {
              var i = value.indexOf("; Secure");
              if (i > -1) {
                  value = value.substring(0, i);
              }
          }

          // if the original request is secure, ensure cookies has "secure" set
          var xForwardedHost = req.headers["x-forwarded-proto"];
          if (req.secure || "https" === xForwardedHost) {
              var i = value.toLowerCase().indexOf("; secure");
              var j = value.toLowerCase().indexOf(";secure");
              if (i === -1 && j === -1) {
                  value += ";secure";
              }
          }

          return value;
        }

        var _setHeader = res.setHeader;
        res.setHeader = function(key, value)
        {
            if (key.toLowerCase() === "set-cookie")
            {
                for (var x in value)
                {
                    value[x] = updateSetCookieValue(value[x]);
                }
            }

            var existing = this.getHeader(key);
            if (!existing) {
                _setHeader.call(this, key, value);
            }
        };

        util.setHeaderOnce(res, "Cache-Control", "no-store");
        util.setHeaderOnce(res, "Pragma", "no-cache");
        util.setHeaderOnce(res, "Expires", "Mon, 7 Apr 2012, 16:00:00 GMT"); // already expired

        util.setHeader(res, "X-Powered-By", "Cloud CMS Application Server");

        proxyServer.web(req, res);
      });
      proxyHandler = proxyHandlerServer.listeners('request')[0];
  };

  var proxyHandler;

  var r = {};

  r.proxy = function() {
      return function(req, res, next) {
          if (sails.config && sails.config.proxy && sails.config.proxy.enabled) {
            sails.log.info('proxy is enabled');
            if (req.url.indexOf("/proxy") === 0) {
              if (!proxyHandler) {
                sails.log.info('proxy initializing');
                initialize();
              }
              sails.log.info('request proxied');
              req.url = req.url.substring(6); // to strip off /proxy
              if (req.url == "") {
                req.url = "/";
              }
              proxyHandler(req, res);

              // caching scenario
              /*_handleCacheRead(req, function (err, readStream) {

                  if (!err && readStream)
                  {
                      util.sendFile(res, readStream, function (err) {
                          // done!
                      });
                      return;
                  }

                  _handleWrapCacheWriter(req, res, function(err) {

                      proxyHandler(req, res);

                  });
              });*/
            } else {
              sails.log.info('request not proxied');
              next();
            }
          } else {
            sails.log.info('proxy is disabled');
            next();
          }
      };
  };

  return r;
}();
