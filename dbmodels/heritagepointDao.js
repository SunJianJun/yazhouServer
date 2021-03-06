﻿var mongodb = require('./mongodb');
var HeritagepointSchema = require('./heritagepointschema');
var db = mongodb.mongoose.connection; 
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  
console.log('mongodb connection is ok!:'+mongodb);
});
    

//console.log('mongodb Schema:'+Schema);

var Heritagepointmodel=HeritagepointSchema.Heritagepointmodel;

console.log('mongodb Heritagepoint model is ok?:'+mongodb.mongoose.model("Heritagepoint"));
//for(var i in Heritagepoint){console.log("Heritagepoint model items："+i+"<>")};
var HeritagepointDAO = function(){};

HeritagepointDAO.prototype.save = function(obj, callback) {
	//Heritagepointmodel.create();
	// 终端打印如下信息
console.log('called Heritagepoint save');

console.log('obj.name'+obj.name);
var instance = new Heritagepointmodel(obj);
console.log('instance.save:'+instance.name);
instance.save(obj,function(err){
	console.log('save Heritagepoint'+instance+' fail:'+err);
callback(err);
});
};

HeritagepointDAO.prototype.findByName = function(name, callback) {
Heritagepointmodel.findOne({name:name}, function(err, obj){
callback(err, obj);
});
};

//得到所有文化遗产
HeritagepointDAO.prototype.findAll = function(callback) {
Heritagepointmodel.find({}, function(err, obj){
callback(err, obj);
});
};

//根据id更新文化遗产
HeritagepointDAO.prototype.updateById=function(hpobj,callback){
	console.log('called Heritagepoint update id:'+hpobj._id);

  var _id = hpobj._id; //需要取出主键_id
  delete hpobj._id;    //再将其删除
  Heritagepointmodel.update({_id:_id},hpobj,function(err,obj){
	callback(err, obj);
	});
  //此时才能用Model操作，否则报错
};

//用id来删除
HeritagepointDAO.prototype.removeById = function(id, callback) {
console.log('调用了HeritagepointDAO.prototype.removeById :'+id);
Heritagepointmodel.remove({_id:id}, function(err, obj){
callback(err, obj);
});
};


module.exports = new HeritagepointDAO();