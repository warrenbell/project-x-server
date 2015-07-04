module.exports = {
  testAppUserConnection: function (req, res) {
    //sails.services.gitanaservice.getAppUserConnection(function(err)
    // 'warish', '6cti5qf8Li'
    sails.services.gitanaservice.getAppUserConnection(function(err) {

      if(err) {
        res.send(err.output);
        return;
      }
      var platform = this.platform();
      //var application = this.application();

        platform.listRepositories({
            "limit": -1
        }).then(function() {
          res.send(JSON.stringify(this, null, 2));
        });



    });
  },
  testUserConnection: function (req, res) {

    sails.services.gitanaservice.getUserConnection(req, res, function(err) {

      if(err) {
        res.send(err.output);
        return;
      }
      var platform = this.platform();
      //var application = this.application();

        platform.listRepositories({
            "limit": -1
        }).then(function() {
          //sails.log.info("directory:" + JSON.stringify(this, null, 2));
          res.send(JSON.stringify(this, null, 2));
        });



    });

  },
  testUserDisconnect: function (req, res) {

    sails.services.gitanaservice.disconnectUserConnection(req, res, function(err) {

      if(err) {
        res.send(err.output);
        return;
      }
      //var platform = this.platform();

      res.send(JSON.stringify(this, null, 2));
      //var application = this.application();

        /*platform.listRepositories({
            "limit": -1
        }).then(function() {
          //sails.log.info("directory:" + JSON.stringify(this, null, 2));
          res.send(JSON.stringify(this, null, 2));
        });*/



    });

  }
};
