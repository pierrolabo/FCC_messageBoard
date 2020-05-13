/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var Thread = require('../models/Thread');

module.exports = function (app) {
  app
    .route('/api/threads/:board')
    .get(async (req, res) => {
      console.log('GET REQ QUERY => ', req.query);
      console.log('GET PARAMS => ', req.params);
      console.log('GET body => ', req.body);
      let board = req.params.board;
      let doc = await Thread.getMostRecentThread(board);
      console.log('API => get => ', doc);
      res.json(doc);
    })
    .post(async (req, res) => {
      console.log('POST body => ', req.body);
      let board = req.body.board;
      let text = req.body.text;
      let delete_password = req.body.delete_password;
      let newThread = new Thread(
        null,
        board,
        text,
        null,
        null,
        false,
        delete_password,
        null
      );
      let doc = await newThread.createThread();
      if (doc.httpCode === 200) {
        //success
        console.log('API => success ', doc.httpCode);
        res.status(200).redirect(`/b/${doc.data.board}`);
      }
    });

  app.route('/api/replies/:board').get(async (req, res) => {
    let board = req.params.board;
    let query = req.query.thread_id;
    let doc = await Thread.getThreadById(query);
    console.log('API => GET:BOARD => ', doc);
    res.json(doc);
  });
};
