const mongoose = require('mongoose');
let _db;

const mongoConnect = (callback) => {
  mongoose
    .connect(process.env.DATABASE_LOCALE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((client) => {
      console.log('Mongo Connected!');
      _db = client;
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    console.log('_getdb => ');
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
