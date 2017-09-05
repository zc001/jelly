var handler = require('../handler/jellyHandler')();

/**
 * @brief: 请求处理中间件
 * */
function handleRequest () {
	return function* (next) {
		var self = this
		,	path = self.path;
		//提取path name
		path = path || '/';
		try{
			path = path.slice(1);
		}catch(error){
			global.logger.error('handleRequest - error ', error);
			return self.res.end(global.ERROR_MSG);
		}
		//不能处理的请求
		if(!handler[path]){
			global.logger.error('handleRequest - no handler ');
			return self.res.end(global.ERROR_MSG);
		}
		//实际逻辑部分
		var response = yield handler[path](self.msg);
		global.logger.debug('middleware - handleRequest - response: ', response);
		//返回
		self.res.end(response);
	} 
};

module.exports = handleRequest;
