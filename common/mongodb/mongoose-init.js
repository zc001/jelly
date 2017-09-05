var util = require('util')
,	co = require('co');

/**
 * @brief: 初始化mongodb
 * */
exports.init = co.wrap(function* (app) {
	var mongoose = require('mongoose');
	var schema = require('./schema');
	//简单的配置信息
	var mongodbConfig = {
	    "mongodb":
	        {
	            "driver":   "mongodb",
	            "host":     "127.0.0.1",
	            "port":     27017,
	            "database": "jelly",
	            "user":     "",
	            "pass":     "",
	            "options": {
	                "server": {
	                    "socketOptions ": { "keepAlive": 1 },
	                    "poolSize": 1
	                },
	                "db": {
	                },
	                "replset": {
	                    "socketOptions ": { "keepAlive": 1 }
	                }
	            }
	        }
	};
	var dbUrl = util.format('mongodb://%s:%s/%s', mongodbConfig.mongodb.host, mongodbConfig.mongodb.port, mongodbConfig.mongodb.database);
	mongoose.connect(dbUrl, mongodbConfig.mongodb.options);

	//连接状态
	var db = mongoose.connection;
	db.on('error', function (error) {
		global.logger.error('server setup [mongodb] - connected to [%s] error: ', dbUrl, error);
	});

	db.once('open', function() {
		global.logger.info('server setup [mongodb] - connected to [%s] successfully', dbUrl);
	});

	//加载model
	mongoose.model('battle', schema['battle']);
	
	//挂载
	global.mongoose = mongoose;
	app.mongoose = mongoose;
});