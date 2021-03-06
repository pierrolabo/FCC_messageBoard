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
//Those var are for testing purpose
//each has a mongoId
let testId = '';
let deleteId = '';
let replyId = '';
let putId = '';
chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('API ROUTING FOR /api/threads/:board', function () {
    test('POST a thread', function (done) {
      chai
        .request(server)
        .post('/api/threads/general')
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
    test('POST a thread to delete', function (done) {
      chai
        .request(server)
        .post('/api/threads/general')
        .send({
          board: 'general',
          text: 'POST to DELETE',
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
          //test is array ...
          deleteId = res.body[0]._id;
          testId = res.body[1]._id;
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
    suite('DELETE', function () {
      test('DELETE THREAD', function (done) {
        chai
          .request(server)
          .delete('/api/threads/general/')
          .send({
            board: 'general',
            thread_id: deleteId,
            delete_password: 'azerty',
          })
          .end(function (err, res) {
            assert.equal(res.body, 'success');
            done();
          });
      });
    });
    suite('PUT', function () {
      test('REPORT THREAD', function (done) {
        chai
          .request(server)
          .put('/api/threads/general/')
          .send({
            thread_id: testId,
          })
          .end(function (err, res) {
            assert.equal(res.body, 'success');
            done();
          });
      });
    });
  });

  suite('API ROUTING FOR /api/replies/:board', function () {
    suite('POST', function () {
      test('POST a first reply ', function (done) {
        chai
          .request(server)
          .post('/api/replies/general')
          .send({
            thread_id: testId,
            text: 'A first reply from chaijs',
            delete_password: 'azerty',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
      test('POST a second reply ', function (done) {
        chai
          .request(server)
          .post('/api/replies/general')
          .send({
            thread_id: testId,
            text: 'A second reply from chaijs',
            delete_password: 'azerty',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
      test('POST a third reply ', function (done) {
        chai
          .request(server)
          .post('/api/replies/general')
          .send({
            thread_id: testId,
            text: 'A third reply from chaijs',
            delete_password: 'azerty',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
      test('POST a fourth reply ', function (done) {
        chai
          .request(server)
          .post('/api/replies/general')
          .send({
            thread_id: testId,
            text: 'A fourth reply from chaijs',
            delete_password: 'azerty',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
    suite('GET', function () {
      test('GET POST by ID', function (done) {
        chai
          .request(server)
          .get(`/api/replies/${testId}`)
          .end(function (err, res) {
            if (err) console.log(err);
            assert.equal(res.body._id, testId);
            assert.equal(res.body.replies[0].text, 'A first reply from chaijs');
            assert.equal(
              res.body.replies[1].text,
              'A second reply from chaijs'
            );
            assert.equal(res.body.replies[2].text, 'A third reply from chaijs');
            //Update replyId so we can test it
            replyId = res.body.replies[2]._id;
            putId = res.body.replies[0]._id;
            done();
          });
      });
    });
    suite('PUT', function () {});

    suite('DELETE', function () {
      //write at the end
      test('DELETE THREAD', function (done) {
        chai
          .request(server)
          .delete('/api/replies/general/')
          .send({
            thread_id: testId,
            reply_id: replyId,
            delete_password: 'azerty',
          })
          .end(function (err, res) {
            assert.equal(res.body, 'success');
            done();
          });
      });
    });
    suite('PUT', function () {
      test('REPORT THREAD', function (done) {
        chai
          .request(server)
          .put('/api/replies/general/')
          .send({
            thread_id: testId,
            reply_id: replyId,
          })
          .end(function (err, res) {
            assert.equal(res.body, 'success');
            done();
          });
      });
    });
  });
});
