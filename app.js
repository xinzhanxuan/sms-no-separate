
// 加载 express 模块
var express = require('express');
// 加载 config 模块
var config = require('./config.js');
var path = require('path');
var boydParser = require('body-parser');
// 加载路由模块
var router = require('./router.js');

// 创建 app 对象
var app = express();

// 做一些挂载操作（挂载 body-parser中间价、设置模板引擎、挂载路由）
// 1. 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// 2. 挂载一个 body-parser 中间件
app.use(boydParser.urlencoded({extended: false}));


// 3. 挂载路由模块
app.use(router);



// 启动服务
app.listen(config.port, function () {
  console.log('http://localhost:' + config.port);
});