/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('API ROUTING FOR /api/threads/:board', function () {
    test('POST', function (done) {
      chai
        .request(server)
        .post('/api/threads/test')
        .send({
          board: 'general',
          text: 'POST a Thread',
          delete_password: 'azerty',
        })
        .end(function (err, res) {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          done();
        });
    });

    test('GET', function (done) {
      chai
        .request(server)
        .get('/api/threads/general')
        .end(function (err, res) {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          done();
        });
    });
    test('GET blank board', function (done) {
      chai
        .request(server)
        .get('/api/threads/blank')
        .end(function (err, res) {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          done();
        });
    });

    suite('DELETE', function () {});

    suite('PUT', function () {});
  });

  suite('API ROUTING FOR /api/replies/:board', function () {
    suite('POST', function () {});

    suite('GET', function () {});

    suite('PUT', function () {});

    suite('DELETE', function () {});
  });
});
