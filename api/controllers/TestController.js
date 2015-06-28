module.exports = {
  test: function (req, res) {
    //sails.log.info('GitanaService3=' + sails.services.gitanaservice.getDriver());
    sails.services.gitanaservice.getDriver();
    /*for (var key in sails.services) {
      sails.log.info('KEY=' + key);
    }*/

    return res.send("Hi there!");
  }
};
