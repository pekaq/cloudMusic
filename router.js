var express = require('express')
var fs = require('fs')
var fileOS = require('./fileOS.js')
// var databaseOS = require('./databaseOS.js')

// 创建路由容器
var router = express.Router()

// 挂载路由
router.get('/', function(req, res) {
	res.render("index.html");
})

router.post('/denglu', function(req, res) {
	fileOS.find(function(err, results) {
		if (err) {
			return res.send('404')
		}
		console.log(req.body.user,req.body.psd);
		console.log(results);
		var user = req.body.user
		var psd = req.body.psd
		var returnMsg = null
		console.log(user, psd);
		for (var i=0; i<results.length; i++) {
			if (results[i].name == user && results[i].pwd == psd) {
				returnMsg = ["1",results[i].name, results[i].pic,results[i].id]
			}
			else {
				returnMsg = ["0"]
			}
		}
		res.send(returnMsg);
	})
})

// 导出 router
module.exports = router