var mysql = require('mysql');

// 创建连接
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'good'
});

// 连接数据库
connection.connect();

// 查询数据
exports.find = function(callback) {
	connection.query('SELECT * FROM `goods`', function (err, results, fields) {
		if (err) {
			console.log(err);
			return callback(err)
		};
		// console.log('The solution is: ', results);
		callback(null, results)
		// 关闭连接
		// connection.end();
	});
}
