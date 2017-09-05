/**
 * @brief: 参数构造 
 * */
function buildMsg () {
	return function* (next) {
		var self = this;
		//URL中的数据
    	self.msg = self.request.query || {};
    	global.logger.debug('middleware - buildMsg - msg: ', self.msg);
	    yield* next;
	} 
};

module.exports = buildMsg;
