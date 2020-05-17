const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  postId: {
    type: Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  text: { type: String },
  created_on: { type: Date },
  delete_password: { type: String },
  reported: { type: Boolean },
});

const MongoReply = mongoose.model('comments', ReplySchema);

class Reply extends MongoReply {
  constructor(_id, text, delete_password) {
    super();
    this._id = _id ? _id : new mongoose.Types.ObjectId();
    this.postId = this._id;
    this.text = text;
    this.created_on = new Date();
    this.delete_password = delete_password;
    this.reported = false;
  }

  async createReply() {
    let dbOps = await super
      .save(this)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log('createComment() => ERROR => ', error);
      });
    return dbOps;
  }
}

module.exports = Reply;
