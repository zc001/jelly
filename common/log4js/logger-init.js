var co = require('co')
,	_ = require('underscore')
,	log4js = require('log4js');

/**
 * @brief: 初始化log4js
 * */
exports.init = co.wrap(function* (app) {
	//简单的配置信息
	log4js.configure({
	  appenders: [{
	    type: 'logLevelFilter',
	    level: 'DEBUG',
	    category: 'default',
	    appender: {
	      type: 'file',
	      filename: 'default.log'
	    }
	  },
	  {
	    type: "console"
	  }]
	});
	//获取log实例
	var logger = log4js.getLogger('default');
	app.logger = logger;
	global.logger = logger;
});