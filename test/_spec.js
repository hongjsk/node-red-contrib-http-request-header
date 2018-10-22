var should = require('should')
var helper = require('node-red-node-test-helper')
var testNode = require('../http-request-header.js')

helper.init(require.resolve('node-red'));

describe('http-request-header Node', function () {
  this.timeout(15000);

  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
      helper.unload();
      helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    var flow = [{
      "id":"n1",
      "type":"http-request-header",
      "name":"test name",
      "items":[{"k":"k1","v":"v1","vt":"str"}],
      "wires":[[]]
    }]
    helper.load(testNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  it('should make headers for HTTP', function (done) {
    var flow = [{
      "id":"n1",
      "type":"http-request-header",
      "name":"test name",
      "items":[{"k":"User-Agent", "v":"Awesome", "vt":"str"}],
      "wires":[['n2']]
    },
    {
      "id": "n2", 
      "type": "helper"
    }]
    
    helper.load(testNode, flow, function () {
      var n2 = helper.getNode('n2')
      var n1 = helper.getNode('n1')
      n2.on('input', function (msg) {
        msg.should.have.property('headers')
        msg.headers.should.have.property('User-Agent', 'Awesome')
        done()
      })
      n1.receive({payload:"foo",topic: "bar"});

    })
  })

  it('should make headers with mustache', function (done) {
    var flow = [{
      "id":"n1",
      "type":"http-request-header",
      "name":"test name",
      "items":[{"k":"User-Agent", "v":"Awesome {{payload}}", "vt":"str"}],
      "wires":[['n2']]
    }, {
      "id": "n2", 
      "type": "helper"
    }]
    
    helper.load(testNode, flow, function () {
      var n2 = helper.getNode('n2')
      var n1 = helper.getNode('n1')
      n2.on('input', function (msg) {
        msg.should.have.property('headers')
        msg.headers.should.have.property('User-Agent', 'Awesome foo')
        done()
      })
      n1.receive({payload:"foo",topic: "bar"});

    })
  })
})