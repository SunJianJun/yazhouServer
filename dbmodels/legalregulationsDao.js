﻿var mongodb = require('./mongodb');
var LegalregulationsSchema = require('./legalregulationsschema');
var PersonDAO = require('./personDao')
var db = mongodb.mongoose.connection;

db.on('error', console.error.bind(console, '连接错误:'));
db.on('open', function () {
  console.log('mongodb LegalregulationsSchema connection is ok!:' + mongodb);
});

//console.log('mongodb Schema:'+Schema);
var Legalregulationsmodel = LegalregulationsSchema.Legalregulationsmodel;

var Legalregulations = function () {};

Legalregulations.prototype.getetitle=function(id,callback){
  Legalregulationsmodel.findOne({_id:id},function(err,obj){
      callback(err,obj)
  })
}
//添加一个法规
Legalregulations.prototype.save = function (obj, callback) {
  var instance = new Legalregulationsmodel(obj);
  //console.log('param value:' + obj + '<>instance.save:' + instance);
  instance.save(function (err) {
    callback(err, instance);
  });
};

//修改法规名称
Legalregulations.prototype.updatelawname=function(id,parent,callback){
  Legalregulationsmodel.update({_id:id},{lawname:parent},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}

//根据职务获取直接职务信息
Legalregulations.prototype.getlegalregulations=function(id,callback){
  Legalregulationsmodel.findOne({_id:id},'parentTitle',function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}

//获取部门内所有法规
Legalregulations.prototype.getdepartmentlaw=function(deoartment,callback){
  Legalregulationsmodel.find({department:deoartment,status:1},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}
//获取职务级别
Legalregulations.prototype.removenewdepartmentlaw=function(id,callback){
  Legalregulationsmodel.update({_id:id},{status:0},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}


var daoObj = new Legalregulations();
// for(var laws=1,lawsarr=[];laws<10;laws++){
//   lawsarr.push('第'+laws+'条')
// }
// daoObj.save({
//   department:"58c3a5e9a63cf24c16a50b8e",//person 的 id
//   lawname:'中华人民共和国城乡规划法',
//   lawlist:lawsarr,
//   create_date:new Date,
//   newer:new Date,
//   grade:1
// },function(){})
//daoObj.save({
//  department:"58c3a5e9a63cf24c16a50b8e",//person 的 id
//  lawname:'海南省城乡规划条例',
//  lawlist:lawsarr,
//  create_date:new Date,
//  newer:new Date,
//  grade:2
//},function(){})
//daoObj.save({
//  department:"58c3a5e9a63cf24c16a50b8e",//person 的 id
//  lawname:'海南经济特区个体工商户管理办法',
//  lawlist:lawsarr,
//  create_date:new Date,
//  newer:new Date,
//  grade:2
//},function(){})
//daoObj.save({
//  department:"58c3a5e9a63cf24c16a50b8e",//person 的 id
//  lawname:'无照经营查处取缔办法',
//  lawlist:lawsarr,
//  create_date:new Date,
//  newer:new Date,
//  grade:1
//},function(){})
//daoObj.save({
//  department:"58c3a5e9a63cf24c16a50b8e",//person 的 id
//  lawname:'中华人民共和国行政强制法',
//  lawlist:lawsarr,
//  create_date:new Date,
//  newer:new Date,
//  grade:1
//},function(){})
module.exports = daoObj;