var Schema = require('mongoose').Schema;
var Schemas = {};

/**
 * @brief: 关卡表
 * */
Schemas['battle'] = new Schema({
    sessionId:          {type: String, default: ''},         //关卡唯一id      
    table: 				[] 									 //棋盘	      
});
Schemas['battle'].index({sessionId: 1}, {unique: true}); 	 //唯一索引	

module.exports = Schemas;













