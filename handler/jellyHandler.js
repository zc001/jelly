module.exports = function () {
    return new Handler();
};

/**
 * @brief: 处理器
 * */
var Handler = function () {
	var self = this;
	self.jellyController = require('../controller/jellyController').create();
};

var pro = Handler.prototype;

/**
 * @brief: 开始关卡
 * */
pro['start-level'] = function (msg) {
	var self = this;
	//具体逻辑
	return self.jellyController['start-level'](msg);
};

/**
 * @brief: 移动
 * */
pro.move = function (msg) {
	var self = this;
	//具体逻辑
	return self.jellyController.move(msg);
};

