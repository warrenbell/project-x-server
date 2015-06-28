var VALID_IP_ADDRESS_REGEX_STRING = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";

exports = module.exports;

var isIPAddress = exports.isIPAddress = function(text)
{
    var rx = new RegExp(VALID_IP_ADDRESS_REGEX_STRING);
    return rx.test(text);
};

var setHeaderOnce = exports.setHeaderOnce = function(response, name, value)
{
    var existing = response.getHeader(name);
    if (typeof(existing) == "undefined") {
        setHeader(response, name, value);
    }
};

var setHeader = exports.setHeader = function(response, name, value)
{
    try {
      response.setHeader(name, value);
    } catch (e) {
    }
};
