var co = require('co')
,	md5 = require('md5')
,	Battle = require('./battle');

/**
 * @brief: 关卡管理器
 * */
function BattleManager () {
	var self = this;
	//关卡数据模型
	self.battleModel = global.mongoose.connection.model('battle');
};

var pro = BattleManager.prototype;

/**
 * @brief: 构造sessionId
 * */
pro.buildSessionId = function (level, uid) {
	var self = this;
	//容错
	level = level || '1';
	uid = uid || '10000';
	//构造
	return md5(level + '-' + uid);
};

/**
 * @brief: 根据id获取关卡db数据
 * */
pro.getBattleDocByID = function (sessionId) {
	var self = this;
	return self.battleModel.findOne({sessionId: sessionId}).exec();
};

/**
 * @brief: 创建关卡db数据
 * */
pro.createBattleDoc = function (sessionId) {
	var self = this;
	return self.battleModel.create({sessionId: sessionId, table: []});
};

/**
 * @brief: 根据id获取关卡实例
 * */
pro.getBattleByID = co.wrap(function* (sessionId) {
	var self = this;
	var doc = yield self.getBattleDocByID(sessionId);
	if(!doc){
		return null;
	}
	return new Battle(doc);
});

/**
 * @brief: 创建关卡实例
 * */
pro.createBattle = co.wrap(function* (level, uid) {
	var self = this
	,	sessionId = self.buildSessionId(level, uid)
	var doc = yield self.createBattleDoc(sessionId);
	var battle = new Battle(doc);
	battle.init();
	yield battle.save();
	return battle;
});

//单例
var instance = null;
exports.create = function () {
    if (instance == null) {
        instance = new BattleManager();
    }
    return instance;
};