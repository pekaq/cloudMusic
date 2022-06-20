var filePath = './public/data.json'
var fs = require('fs')

exports.find = function(callback) {
	fs.readFile(filePath, 'utf8', function(err, data) {
		if (err) {
			return callback(err)
		}
		console.log("读取成功");
		callback(null, JSON.parse(data).users)
	})
}