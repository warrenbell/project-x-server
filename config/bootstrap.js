/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var Gitana = require("gitana");

module.exports.bootstrap = function(cb) {

  // This function runs every 30 minutes refreshing the Gitana driver by reauthenticating the appuser and receiving a new token
  var initAutoRefreshGitanaDriver = function() {
    setInterval(function() {
      var gitanaConfig = sails.config.gitanaConfig;
      if (gitanaConfig)
      {
          // we force the cache key to the application id
          gitanaConfig.key = gitanaConfig.application;
          if (!gitanaConfig.key)
          {
              gitanaConfig.key = "default";
          }
      }
      sails.log.info('Gitana Driver Health Check thread running...');
      Gitana.connect(gitanaConfig, function(err) {

          var g = this;

          if (err)
          {
              sails.log.info('Caught error while running auto-refresh');
              sails.log.info('Error:' + err);
              sails.log.info(JSON.stringify(err));

              sails.log.info('Removing key: ' + gitanaConfig.key);
              Gitana.disconnect(gitanaConfig.key);

              return;
          }
          else
          {
              sails.log.info('Refreshing Gitana Driver');

              g.getDriver().refreshAuthentication(function(err) {

                  if (err) {
                      sails.log.info('Refresh Authentication caught error: ' + JSON.stringify(err));

                      sails.log.info('Auto disconnecting key: ' + gitanaConfig.key);
                      Gitana.disconnect(gitanaConfig.key);
                  } else {
                      sails.log.info('Successfully refreshed authentication for appuser');
                      sails.log.info('grant time: ' + new Date(g.getDriver().http.grantTime()));
                      sails.log.info('access token: ' + g.getDriver().http.accessToken());
                  }
              });
          }
      });
    }, (30*60*1000)); // thirty minutes
  };

  initAutoRefreshGitanaDriver();

  // Use below if you want to run some code after sails has lifted
  /*sails.on('lifted', function() {
       // Your post-lift startup code here
  });*/

  
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
