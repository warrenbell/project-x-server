var Gitana = require("gitana");

module.exports = {
  initDriver: function() {
    sails.log.info('Gitana driver initializing');
    this.initAutoRefreshDriver();
    this.init = true;
  },
  initAutoRefreshDriver: function() {
    sails.log.info('Gitana driver "auto refresh" initializing');
  },
  getDriver: function() {
    if (!init) {
      this.initDriver();
    }
    sails.log.info('Retrieving Gitana driver');
    //return gitanaDriver;
  },
  init: undefined
};
