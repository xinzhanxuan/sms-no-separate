// 路由模块


var express = require('express');
// 加载 handler 模块
var handler = require('./handler.js');

// 1. 创建路由对象
var router = express.Router();


// 2. 设置路由

// 首页
router.get('/', handler.get.index);
router.get('/index', handler.get.index);



// 学员列表
router.get('/students',handler.get.students);


// 显示添加学员页面
router.get('/add', handler.get.add);



// 处理添加一位学员
router.post('/add', handler.post.add);


// 显示学员详情
router.get('/info', handler.get.info);

// 删除一条学员
router.get('/delete', handler.get.delete);


// 显示编辑学员页面
router.get('/edit', handler.get.edit);


// 保存更新的学员
router.post('/edit', handler.post.edit);








// 3. 返回路由对象
module.exports = router;