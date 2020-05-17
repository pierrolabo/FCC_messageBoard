const mongoose = require('mongoose');

const mongoConnect = (callback) => {
  mongoose
    .connect(process.env.DATABASE, {
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

exports.mongoConnect = mongoConnect;
