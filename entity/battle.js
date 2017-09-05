var co = require('co');

//常量
var BALLS = [{type: 'B', weight: 100}, 
			 {type: 'H', weight: 100}, 
			 {type: 'V', weight: 100}, 
			 {type: 'S', weight: 100}]    //果冻list
,	MAX_ROW = 8							//最大行
,	MAX_COL = 8;						//最大列

/**
 * @brief: 关卡类
 * */
function Battle (battleDoc) {
	var self = this;
	self.battleDoc = battleDoc;
	self.table = battleDoc.table;
}

module.exports = Battle;

var pro = Battle.prototype;

/**
 * @brief: 入库
 * */
pro.save = co.wrap(function* () {
	var self = this;
	//混合类型的在入库前要执行markModified操作
	self.battleDoc.markModified('table');
	yield self.battleDoc.save();
});

/**
 * @brief: 随机果冻
 * */
pro.randomBall = function () {
	var self = this
	,	fullWeight = 0;
	BALLS.forEach(function (ball) {
		fullWeight += ball.weight;
	});
	var random = Math.random() * fullWeight;
	for(var i = 0; i < BALLS.length; i ++){
		if(random < BALLS[i].weight){
			return BALLS[i].type;
		} else {
			random -= BALLS[i].weight;
		}
	}
	return 'B';
};

/**
 * @brief: 初始化棋盘
 * */
pro.init = function () {
	var self = this;
	for(var i = 0; i < MAX_ROW; i ++){
		self.table[i] = [];
		for(var j = 0; j < MAX_COL; j ++){
			self.table[i].push(self.randomBall());
		}
	}
};

/**
 * @brief: 含有sessionId的客户端数据
 * */
pro.buildFullClientInfo = function () {
	var self = this
	,	str = '';
	str += (self.battleDoc.sessionId + '\n');
	for(var i = 0; i < MAX_ROW; i ++){
		str += (self.battleDoc.table[i].join('') + '\n');
	}
	return str;
};

/**
 * @brief: 客户端棋盘数据
 * */
pro.buildTableClientInfo = function () {
	var self = this
	,	str = '';
	for(var i = 0; i < MAX_ROW; i ++){
		str += (self.battleDoc.table[i].join('') + '\n');
	}
	return str;
};

/**
 * @brief: 位置检测
 * */
pro.checkPosition = function (row0, col0, row1, col1) {
	var self = this;
	//不能越界
	if(row0 < 0 || row0 >= MAX_ROW){
		return false;
	}
	if(row1 < 0 || row1 >= MAX_ROW){
		return false;
	}
	if(col0 < 0 || col0 >= MAX_COL){
		return false;
	}
	if(col1 < 0 || col1 >= MAX_COL){
		return false;
	}
	//相对位置不正确
	if(row1 < row0 || col1 < col0){
		return false;
	}
	return true;
};

/**
 * @brief: 消除
 * */
pro.doRemove = function (row, col) {
	var self = this;
	//本行已经被消除
	if(!self.table[row]){
		return;
	}
	var type = self.table[row][col];
	//元素已经被消除
	if(!type){
		return;
	}
	// global.logger.debug('Battle instance - doRemove - (%s, %s) type[%s]', row, col, type);
	//置空
	self.table[row][col] = null;
	//消除效果
	switch(type){
		case 'H':
			//横向炸弹
		 	for(var i = 0; i < MAX_COL; i++){
		 		self.doRemove(row, i);
		 	}
			break;
		case 'V':
			//竖向炸弹
		 	for(var i = 0; i < MAX_ROW; i++){
		 		self.doRemove(i, col);
		 	}
			break;
		case 'S':
			//方块炸弹
			var minRow = Math.max(0, row - 1)
			,	maxRow = Math.min(MAX_ROW, row + 1)
			,	minCol = Math.max(0, col - 1)
			,	maxCol = Math.min(MAX_COL, col + 1);
			for(var i = minRow; i <= maxRow; i ++){
				for(var j = minCol; j <= maxCol; j ++){
					self.doRemove(i, j);
				}
			}
			break;				
	}
};

/**
 * @brief: 下落
 * */
pro.fall = function () {
	var self = this;
	//从第一列开始
	for(var j = 0; j < MAX_COL; j ++){
		//从最后一行开始
		for(var i = MAX_ROW - 1; i >=0; i --){
			//没有被消除
			if(self.table[i][j]){
				continue;
			}
			//移动
			for(var m = i; m >= 0; m --){
				if(self.table[m][j]){
					self.table[i][j] = self.table[m][j];
					self.table[m][j] = null;
					continue;
				}
			}
			//生成
			if(!self.table[i][j]){
				self.table[i][j] = self.randomBall();
			}
		}
	}
};

/**
 * @brief: 移动
 * */
pro.move = co.wrap(function* (row0, col0, row1, col1) {
	var self = this;
	//位置检测
	if(!self.checkPosition(row0, col0, row1, col1)){
		return global.ERROR_MSG;
	}
	//消除
	for(var i = row0; i <= row1; i ++){
		for(var j = col0; j <= col1; j ++){
			self.doRemove(i, j);
		}
	}
	//下落
	self.fall();
	//入库
	yield self.save();
	//返回数据
	return self.buildTableClientInfo();
});










