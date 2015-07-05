var expect = require('expect.js');
var httpMocks = require('node-mocks-http');

// Uses Mocha and Expect for testing
// Athorization header for GOOD username "test1" with GOOD password "test1": "Basic dGVzdDE6dGVzdDE=" exclude quotes
// Athorization header for GOOD username "test2" with GOOD password "test2": "Basic dGVzdDI6dGVzdDI=" exclude quotes
// Athorization header for GOOD username "test1" with BAD password "bogus": "Basic dGVzdDE6Ym9ndXM=" exclude quotes
// Athorization header for BAD username "bogus" with BAD password "bogus": "Basic Ym9ndXM6Ym9ndXM=" exclude quotes

describe.only('GitanaService', function() {

  // This could fail if gitana client key, client secret, username, and password are incorrect.
  // Check config/env/production/gitana.js and config/gitana.js and make sure they match what is at Cloud CMS
  describe('#getAppUserConnection()', function() {
    it('should get an appUser Connection', function (done) {
      this.timeout(30000);
      sails.services.gitanaservice.getAppUserConnection(function(err) {
        expect(err).to.be(undefined);
        done();
      });
    });
  });

  // Athorization header for user "test" with password "test": "Basic dGVzdDp0ZXN0" exclude quotes
  // Athorization header for user warish: "Basic d2FyaXNoOjZjdGk1cWY4TGk=" exclude quotes
  describe('#getUserConnection()', function() {
    it('should get a User Connection using a GOOD username and a GOOD password', function (done) {
      this.timeout(30000);
      var req = httpMocks.createRequest({
        headers: {"Authorization": "Basic dGVzdDE6dGVzdDE="}
      });
      var res = httpMocks.createResponse();
      sails.services.gitanaservice.getUserConnection(req, res, function(err) {
        expect(err).to.be(undefined);
        done();
      });
    });
  });

  // Athorization header for user "test" with BAD password "bogus": "Basic dGVzdDpib2d1cw==" exclude quotes
  describe('#getUserConnection()', function() {
    it('should NOT get a User Connection using a GOOD username and a BAD password', function (done) {
      this.timeout(30000);
      var req = httpMocks.createRequest({
        headers: {"Authorization": "Basic d2FyaXNoOjZjdGk1cWY4TGk3="}
      });
      var res = httpMocks.createResponse();
      sails.services.gitanaservice.getUserConnection(req, res, function(err) {
        sails.log.error(err);
        expect(err).not.to.be(undefined);
        done();
      });
    });
  });

  // Athorization header for user "bogus" with password "bogus": "Basic Ym9ndXM6Ym9ndXM=" exclude quotes
  describe('#getUserConnection()', function() {
    it('should NOT get a User Connection using a BAD username', function (done) {
      this.timeout(30000);
      var req = httpMocks.createRequest({
        headers: {"Authorization": "Basic Ym9ndXM6Ym9ndXM="}
      });
      var res = httpMocks.createResponse();
      sails.services.gitanaservice.getUserConnection(req, res, function(err) {
        sails.log.error(err);
        expect(err).not.to.be(undefined);
        done();
      });
    });
  });

  // Athorization header for user "test" with password "test": "Basic dGVzdDp0ZXN0" exclude quotes
  // Athorization header for user warish: "Basic d2FyaXNoOjZjdGk1cWY4TGk=" exclude quotes
  describe('#getUserConnection()', function() {
    it('should get a User Connection using a Gitana ticket', function (done) {
      this.timeout(30000);
      var req = httpMocks.createRequest({
        headers: {"Authorization": "Basic d2FyaXNoOjZjdGk1cWY4TGk="}
      });
      var res = httpMocks.createResponse();
      sails.services.gitanaservice.getUserConnection(req, res, function(err) {
        var ticket = res.cookies.ticket.value;
        res = httpMocks.createResponse();
        req = httpMocks.createRequest({
          cookies: {ticket: ticket}
        });
        sails.services.gitanaservice.getUserConnection(req, res, function(err) {
          expect(err).to.be(undefined);
          done();
        });
      });
    });
  });

  // Athorization header for user "test" with password "test": "Basic dGVzdDp0ZXN0" exclude quotes
  // Athorization header for user warish: "Basic d2FyaXNoOjZjdGk1cWY4TGk=" exclude quotes
  describe('#getUserConnection()', function() {
    it('should NOT get a User Connection using a BAD Gitana ticket', function (done) {
      this.timeout(30000);
      var req = httpMocks.createRequest({
        headers: {"Authorization": "Basic d2FyaXNoOjZjdGk1cWY4TGk="}
      });
      var res = httpMocks.createResponse();
      sails.services.gitanaservice.getUserConnection(req, res, function(err) {
        var ticket = res.cookies.ticket.value;
        ticket =+ "1234"; // Make ticket bogus
        res = httpMocks.createResponse();
        req = httpMocks.createRequest({
          cookies: {ticket: ticket}
        });
        sails.services.gitanaservice.getUserConnection(req, res, function(err) {
          expect(err).not.to.be(undefined);
          done();
        });
      });
    });
  });

  // Athorization header for user "test" with password "test": "Basic dGVzdDp0ZXN0" exclude quotes
  // Athorization header for user warish: "Basic d2FyaXNoOjZjdGk1cWY4TGk=" exclude quotes
  describe('#getUserConnection()', function() {
    it('should Disconnect User using a Gitana ticket', function (done) {
      this.timeout(30000);
      var ticket;
      var req = httpMocks.createRequest({
        headers: {"Authorization": "Basic d2FyaXNoOjZjdGk1cWY4TGk="}
      });
      var res = httpMocks.createResponse();
      sails.services.gitanaservice.getUserConnection(req, res, function(err) {
        ticket = res.cookies.ticket.value;
        res = httpMocks.createResponse();
        req = httpMocks.createRequest({
          cookies: {ticket: ticket}
        });
        sails.services.gitanaservice.getUserConnection(req, res, function(err) {
          ticket = res.cookies.ticket.value;
          res = httpMocks.createResponse();
          req = httpMocks.createRequest({
            cookies: {ticket: ticket}
          });
          sails.services.gitanaservice.disconnectUserConnection(req, res, function(err) {
            expect(err).to.be(undefined);
            done();
          });
        });
      });
    });
  });




});
