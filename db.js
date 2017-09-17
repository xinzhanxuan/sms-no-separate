// 数据操作模块



// 1. 加载 mongodb 模块
var mongodb = require('mongodb');
// 加载 config 模块
var config = require('./config.js');


// 2. 封装一个连接数据库的方法
function connectDB(callback) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(config.url, function (err, db) {
    // 把连接结果通过 callback 函数传递出去
    callback(err, db);
  });
}


// 3. 封装一个查询某个集合中所有数据的方法
module.exports.findAll = function (collectionName, callback) {
  connectDB(function (err, db) {
    if (err) {
      throw err;
    }

    db.collection(collectionName).find().toArray(function (err, docs) {
      db.close();
      callback(err, docs);
    });
  });
};



// 4. 封装一个插入数据库的方法
module.exports.insertOne = function (collectionName, data, callback) {
  connectDB(function (err, db) {
    if (err) {
      throw err;
    }
    db.collection(collectionName).insertOne(data, function (err, result) {
      db.close();
      callback(err, result);
    });
  });
};

// 5. 把 字符串转换为 ObjectID类型
module.exports.ObjectID = function (strId) {
  return new mongodb.ObjectID(strId);
};


// 6. 封装一个查询单条数据的方法
module.exports.findOne = function (collectionName, filter, callback) {
  connectDB(function (err, db) {
    if (err) {
      throw err;
    }
    db.collection(collectionName).findOne(filter, function (err, doc) {
      db.close();

      callback(err, doc);
    });
  });
};


// 7. 封装一个删除方法
module.exports.deleteOne = function (collectionName, filter, callback) {
  connectDB(function (err, db) {
    if (err) {
      throw err;
    }

    db.collection(collectionName).deleteOne(filter, function (err, result) {
      db.close();
      callback(err, result);
    });
  });
};



// 8. 封装一个 更新数据的方法
module.exports.updateOne = function (collectionName, filter, data, callback) {
  connectDB(function (err, db) {
    if (err) {
      throw err;
    }
    db.collection(collectionName).updateOne(filter, data, function (err, result) {
      db.close();
      callback(err, result);
    });
  });
};