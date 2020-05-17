/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var Thread = require('../models/Thread');
var Reply = require('../models/Reply');
module.exports = function (app) {
  app
    .route('/api/threads/:board')
    .get(async (req, res) => {
      let board = req.params.board;
      let doc = await Thread.getMostRecentThread(board);
      res.json(doc);
    })
    .post(async (req, res) => {
      let board = req.params.board;
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
        res.status(200).redirect(`/b/${board}/`);
      }
    })
    .delete(async (req, res) => {
      let thread_id = req.body.thread_id;
      let delete_password = req.body.delete_password;
      let dbOps = await Thread.deleteThread(thread_id, delete_password);
      if (dbOps === 1) {
        res.json('success');
      } else {
        res.json('incorrect password');
      }
    })
    .put(async (req, res) => {
      let report_id = req.body.report_id;
      let dbOps = await Thread.reportThread(report_id);
      if (dbOps) {
        res.json('success');
      } else {
        res.json('error');
      }
    });

  app
    .route('/api/replies/:board')
    .get(async (req, res) => {
      let board = req.params.board;
      let thread_id = req.query.thread_id;
      let doc = null;
      //We don't use board to find the thread because of uniqueness of ObjectId
      if (thread_id) {
        doc = await Thread.getThreadById(thread_id);
      } else {
        doc = await Thread.getThreadById(board);
      }
      res.json(doc);
    })
    .post(async (req, res) => {
      let board = req.params.board;
      let thread_id = req.body.thread_id;
      let text = req.body.text;
      let delete_password = req.body.delete_password;
      let newReply = new Reply(null, text, delete_password);
      let docReply = await newReply.createReply();
      let doc = await Thread.addThreadReply(thread_id, docReply);
      res.status(200).redirect(`/b/${board}/${thread_id}`);
    })
    .delete(async (req, res) => {
      let post_id = req.body.reply_id;
      let thread_id = req.body.thread_id;
      let delete_password = req.body.delete_password;
      let found = false;
      let replies = await Thread.getThreadRepliesById(thread_id);
      replies.map((reply) => {
        if (post_id == reply._id) {
          if (delete_password == reply.delete_password) {
            //do stuff
            reply.text = '[deleted]';
            found = true;
            return reply;
          } else {
            res.json('incorrect password');
          }
        }
        return reply;
      });
      if (found) {
        await Thread.deletePost(thread_id, replies);
        res.json('success');
      } else {
        console.log('not found');
      }
    })
    .put(async (req, res) => {
      let report_id = req.body.reply_id;
      let thread_id = req.body.thread_id;
      let replies = await Thread.getThreadRepliesById(thread_id);
      replies.map((reply) => {
        if (report_id == reply._id) {
          reply.reported = true;
        }
        return reply;
      });
      let dbOps = await Thread.reportPost(thread_id, replies);
      if (dbOps) {
        res.json('success');
      }
    });
};
