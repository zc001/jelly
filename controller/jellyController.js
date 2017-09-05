var co = require('co')
,	_ = require('underscore')
,	Q = require('q')
,	path = require('path');

/**
 * @brief: 控制器
 * */
function JellyController() {
	var self = this;
	//加载关卡管理器
	self.battleManager = require('../entity/battleManager').create();
};

var pro = JellyController.prototype;

/**
 * @brief: 开始关卡
 * */
pro['start-level'] = co.wrap(function* (msg) {
	//参数初步检查
	if(!msg.level){
		return global.ERROR_MSG;
	}
	var self = this
	,	sessionId = self.battleManager.buildSessionId(msg.level, msg.uid);
	//获取关卡实例
	var battle = yield self.battleManager.getBattleByID(sessionId);
	//没有则创建
	if(!battle){
		battle = yield self.battleManager.createBattle(msg.level, msg.uid);
	}
	//构造返回数据
	return battle.buildFullClientInfo();
});

/**
 * @brief: 移动
 * */
pro.move = co.wrap(function* (msg) {
	//参数初步检查
	if(!msg.sessionId || !msg.row0 || !msg.col0 || !msg.row1 || !msg.col1){
		return global.ERROR_MSG;
	}
	var self = this;
	msg.row0 = parseInt(msg.row0);
	msg.col0 = parseInt(msg.col0);
	msg.row1 = parseInt(msg.row1);
	msg.col1 = parseInt(msg.col1);
	//获取关卡实例
	var battle = yield self.battleManager.getBattleByID(msg.sessionId);
	if(!battle){
		return global.ERROR_MSG;
	}
	return yield battle.move(msg.row0, msg.col0, msg.row1, msg.col1);
});

//单例
var instance = null;
exports.create = function () {
    if (instance == null) {
        instance = new JellyController();
    }
    return instance;
};