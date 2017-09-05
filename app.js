/**
 * @brief: 特别注意 这里使用的koa是1.1.2版本的 
 升级到2.0服务器会不能启动 
 * */
var koa = require('koa')
,   path = require('path')
,	route = require('koa-route')
,	co = require('co')
,	app = koa()
,	loggerInit = require('./common/log4js/logger-init')
,	mongoInit = require('./common/mongodb/mongoose-init')
,	buildMsg = require('./middleware/buildMsg');

//同步写法
co(function* () {

	//启动端口
	var port = process.env.PORT || 3000;

	//初始化log4js
	yield loggerInit.init(app);

	//初始化mongodb
	yield mongoInit.init(app);

	//常量
	global.ERROR_MSG = 'INVALID PARAMS';

	//参数构造中间件，解析请求参数，生成内部各式
	app.use(buildMsg());

	//请求处理中间件
	app.use(require('./middleware/handleRequest')());

	//端口监听
	app.listen(port, function (error) {
		if(error){
			global.logger.error('center server init [server startUp] - error', error);
			return;
		}
		global.logger.info('center server init [server startUp] - port[%s]', port);
	});

	process.on('uncaughtException', function(err) {
		global.logger.error('[%s] ##UncaughtError:[%s]', new Date(), err.stack);
	});
});

