var moment = require('moment');

module.exports = function() {

  var r = {};

  r.accessTimeInterceptor = function() {
    return function(req, res, next) {
      if(req && req.session) {
        var now =  moment();
        if(req.session.accessTime) {
          var lastAccessTime = moment(req.session.accessTime);
          req.session.lastAccessTime = lastAccessTime.from(now);
        }
        req.session.accessTimeReadable = now.format('MMMM Do YYYY, h:mm:ss a');
        req.session.accessTime = now.format();
      }
      next();
    };
  };

  return r;

}();
