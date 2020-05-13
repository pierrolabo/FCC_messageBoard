const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  text: { type: String },
  created_on: { type: Date },
});

const MongoReply = mongoose.model('comments', ReplySchema);

class Reply extends MongoReply {
  constructor(_id, text, created_on) {
    super();
    this._id = _id ? _id : new mongoose.Types.ObjectId();
    this.text = text;
    this.created_on = new Date();
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
