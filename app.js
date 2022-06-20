var express = require('express')
var router = require('./router.js')
var bodyParser = require('body-parser')

var app = express()

// 开放静态资源文件夹
app.use('/public', express.static('./public'))

// 配置body-parser第三方包
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 配置express-art-template引擎
app.engine('html', require('express-art-template'))

// 挂载路由服务
app.use(router)

app.listen(3000, function() {
	console.log('http://127.0.0.1:3000/')
})