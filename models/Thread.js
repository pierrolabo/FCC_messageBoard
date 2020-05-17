const mongoose = require('mongoose');
const getDb = require('../utils/database').getDb;
const Schema = mongoose.Schema;

//Saved will be _id, text, created_on(date&time),
//bumped_on(date&time, starts same as created_on),
//reported(boolean), delete_password, & replies(array).
const ThreadSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  board: { type: String },
  text: { type: String },
  created_on: { type: Date },
  bumped_on: { type: Date },
  reported: { type: Boolean, default: false },
  delete_password: { type: String },
  replies: { type: Array, default: [] },
});

const MongoThread = mongoose.model('threads', ThreadSchema);

class Thread extends MongoThread {
  constructor(
    _id,
    board,
    text,
    created_on,
    bumped_on,
    reported,
    delete_password,
    replies
  ) {
    super();
    this._id = _id ? _id : new mongoose.Types.ObjectId();
    this.board = board;
    this.created_on = new Date();
    this.bumped_on = bumped_on ? bumped_on : new Date();
    this.text = text;
    this.reported = reported;
    this.delete_password = delete_password;
    this.replies = replies ? replies : [];
  }

  async createThread() {
    let dbOps = await super
      .save(this)
      .then((data) => {
        return { httpCode: 200, data: data };
      })
      .catch((error) => {
        console.log(error);
        return { httpCode: 400, data: error };
      });
    return dbOps;
  }
  //I can GET an array of the most recent 10 bumped threads on
  //the board
  //with only the most recent 3 replies from /api/threads/{board}.
  //The reported and delete_passwords fields will not be sent.
  static async getMostRecentThread(board) {
    let dbOps = await super
      .find({ board: board })
      .then((threads) => {
        //Sort by bumped_on then return the first 10 with last slice method
        let sortedThreads = threads
          .slice()
          .sort((a, b) => b.bumped_on - a.bumped_on)
          .slice(0, 10)
          .map((thread) => {
            //Can't delete property on thread object, why ?
            let recentReplies = thread.replies.slice().reverse().slice(0, 3);
            let newThread = {
              _id: thread.id,
              //return the 3 most recent replies
              replies: recentReplies,
              replycount: recentReplies.length,
              created_on: thread.created_on,
              bumped_on: thread.bumped_on,
              board: thread.board,
              text: thread.text,
            };
            return newThread;
          });
        return sortedThreads;
      })
      .catch((err) => {
        console.log('getMostRecentThread() => ERROR => ', err);
      });
    return dbOps;
  }

  //Get Thread by ID
  static async getThreadById(id) {
    let dbOps = await super
      .find({ _id: id })
      .then((thread) => {
        let filteredReplies = thread[0].replies.slice().map((reply) => {
          let newReply = {
            _id: reply._id,
            created_on: reply.created_on,
            text: reply.text,
          };
          return newReply;
        });
        let newThread = {
          _id: thread[0]._id,
          created_on: thread[0].created_on,
          bumped_on: thread[0].bumped_on,
          board: thread[0].board,
          text: thread[0].text,
          replies: filteredReplies,
        };
        return newThread;
      })
      .catch((err) => {
        console.log('getThreadById() => ERROR => ', err);
      });
    return dbOps;
  }

  //Get Thread by ID
  static async getThreadRepliesById(id) {
    let dbOps = await super
      .find({ _id: id })
      .then((thread) => {
        return thread[0].replies;
      })
      .catch((err) => {
        console.log('getThreadRepliesById() => ERROR => ', err);
      });
    return dbOps;
  }
  static async addThreadReply(_id, reply) {
    let query = { _id: _id };
    let update = { $push: { replies: reply }, bumped_on: new Date() };
    let options = { new: true, upsert: true, useFindAndModify: false };
    let dbOps = await super
      .findOneAndUpdate(query, update, options)
      .then((thread) => {
        return thread;
      })
      .catch((error) => {
        console.log('addThreadReply() ', error);
      });
    return dbOps;
  }

  static async deleteThread(_id, password) {
    let query = { _id: _id, delete_password: password };
    let dbOps = await super
      .deleteOne(query)
      .then((data) => {
        return data.deletedCount;
      })
      .catch((error) => {
        console.log('deleteThread => ERROR => ', error);
      });
    return dbOps;
  }

  static async deletePost(thread_id, replies) {
    let query = { _id: thread_id };
    let update = { $set: { replies: replies } };
    let options = { new: true, upsert: true, useFindAndModify: false };
    let dbOps = await super
      .findOneAndUpdate(query, update, options)
      .then((thread) => {
        return thread;
      })
      .catch((error) => {
        console.log('deletePost() ', error);
      });
    return dbOps;
  }

  static async reportThread(thread_id) {
    let query = { _id: thread_id };
    let update = { $set: { reported: true } };
    let options = { new: true, upsert: true, useFindAndModify: false };

    let dbOps = await super
      .findOneAndUpdate(query, update, options)
      .then((thread) => {
        return true;
      })
      .catch((error) => {
        console.log('reportThread() ', error);
        return false;
      });
    return dbOps;
  }
  static async reportPost(thread_id, replies) {
    let query = { _id: thread_id };
    let update = { $set: { replies: replies } };
    let options = { new: true, upsert: true, useFindAndModify: false };
    let dbOps = await super
      .findOneAndUpdate(query, update, options)
      .then((thread) => {
        return true;
      })
      .catch((error) => {
        console.log('reportThread() ', error);
        return false;
      });
    return dbOps;
  }
}
module.exports = Thread;
