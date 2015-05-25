var app = require('../app');
var should = require('should');
var request = require('supertest');

describe('test/test.js', function () {

  it('should return correct json format', function (done) {

    this.timeout(60000); 
    request(app)
      .get('/')
      .end(function (err, res) {
        res.status.should.equal(200);
        var topics = res.body;

        topics.should.be.Array;

        topics.forEach(function (topic) {
          topic.should.have.keys(
            'title',
            'href',
            'comment1'
          );
        });
        done();
    });
  });
});

