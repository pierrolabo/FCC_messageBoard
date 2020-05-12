/*
    let dbOp;
    if (this._id) {
      console.log('update ! ');

      let query = { _id: new mongoose.ObjectId(this._id) };
      dbOp = await super.updateOne(query, { $set: this }, function (err, res) {
        return res;
      });
    } else {
      console.log('insert new ! ');
      dbOp = await super.insertOne(this);
    }

    return dbOp
      .then((result) => {
        console.log('DATA saved ! => ', result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
    */
