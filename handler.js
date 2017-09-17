// 业务模块

// 加载 db 模块
var db = require('./db.js');



module.exports.get = {};
module.exports.post = {};



// 处理首页的请求
module.exports.get.index = function (req, res) {
  // 将 index.html 渲染给浏览器即可
  res.render('index');
};



// 处理显示学员列表
module.exports.get.students = function (req, res) {
  // 1. 获取 students 集合中的所有数据
  db.findAll('students', function (err, docs) {
    if (err) {
      throw err;
    }
    // 2. 直接调用 res.render 渲染
    res.render('students', {list: docs})
  });
};



// 显示添加学员页面
module.exports.get.add = function (req, res) {
  // 1. 读取所有的城市信息
  db.findAll('cities', function (err, docs_city) {
    if (err) {
      throw err;
    }
    // 2. 读取所有的专业信息
    db.findAll('majors', function (err, docs_major) {
      if (err) {
        throw err;
      }
      // 3. 将读取到的信息通过 add.html 页面渲染给浏览器
      res.render('add', {cities: docs_city, majors: docs_major});
    });
  });
};



// 处理 post 添加学员
module.exports.post.add = function (req, res) {
  // 1. 获取用户 post 提交的数据
  // req.body
  // console.log(req.body);
  // 根据用户提交的数据，构建一个插入到数据库中的对象
  var model = {
    sno: req.body.sno,
    sname: req.body.sname,
    sgender: (req.body.sgender === 'F') ? '女' : '男',
    sbirthday: req.body.sbirthday,
    sphone: req.body.sphone,
    saddr: req.body.saddr,
    smajor: req.body.smajor
  };


  // 2. 把 数据插入到数据库中
  db.insertOne('students', model, function (err, result) {
    if (err) {
      throw err;
    }
    // 3. 重定向
    res.redirect('/students');
  });
};



// 实现 get 请求 /info 路径
module.exports.get.info = function (req, res) {
  // 1. 获取用户请求的 _id
  // /info?_id=598fb95c533272bdd0dca1ae
  // req.query._id
  var objId = db.ObjectID(req.query._id);

  // 2. 根据 _id 去数据库中查询到该数据
  db.findOne('students', {_id: objId}, function (err, doc) {
    if (err) {
      throw err;
    }
    // 3. 渲染
    res.render('info', {item: doc});
  });
};


// 实现 get 请求 delete 
module.exports.get.delete = function (req, res) {
  // 获取要删除的学员的 _id
  var objId = db.ObjectID(req.query._id);

  // 根据 _id 从数据库中删除学员信息
  db.deleteOne('students', {_id: objId}, function (err, result) {
    // body..
    if (err) {
      throw err;
    }

    console.log(result.deletedCount);
    // 重定向到 /stuents
    res.redirect('/students');
  });
};



// 实现 get 请求 /edit
module.exports.get.edit = function (req, res) {
  // 1. 获取当前要编辑的学员的 _id
  var objId = db.ObjectID(req.query._id);

  // 2. 根据 _id 去数据库中查找该学员的详细信息
  db.findOne('students', {_id: objId}, function (err, doc_stu) {
    if (err) {
      throw err;
    }

    // 3. 查询所有城市信息
    db.findAll('cities', function (err, docs_city) {
      if (err) {
        throw err;
      }

      // 4. 查询所有专业信息
      db.findAll('majors', function (err, docs_major) {
        if (err) {
          throw err;
        }

        // 6. 渲染(// 5. 让选中某个城市和专业)
        res.render('edit', {item: doc_stu, majors: docs_major, cities: docs_city});
      });
    });
  });

};



// 实现 post 请求 /edit
module.exports.post.edit = function (req, res) {
  // 1. 获取用户 post 提交的数据
  // req.body
  // 获取用户要跟新的 _id
  var objId = db.ObjectID(req.body._id);
  // 获取其他要更新的数据
  var model = {
    sno: req.body.sno,
    sname: req.body.sname,
    sgender: (req.body.sgender === 'F') ? '女' : '男',
    sbirthday: req.body.sbirthday,
    sphone: req.body.sphone,
    saddr: req.body.saddr,
    smajor: req.body.smajor
  };

  // 2. 根据用户提交的数据更新数据库中的学员信息
  db.updateOne('students', {_id: objId}, model, function (err, result) {
    if (err) {
      throw err;
    }
    // 3. 跳转到 /students 页面
    res.redirect('/students');
  });
};







// 服务器分页的思路：
// 1. 先确定每页显示几条
// 2. 再确定要查看第几页
// 3. 计算要查看的这页数据是从 第几条 到 第几条
// 假设每页显示 pagecount 条，要查看第 pageindex 页
// 公式：
// 起始条数：(pageindex - 1) * pagecount + 1
// 到
// pageindex * pagecount