﻿var express = require('express');
var pointrouter = express.Router();

//获得point数据模型
var point = require('../dbmodels/pointschema.js');
	 //console.log('point数据模型是否存在：'+point);

var pointAdd = function(req, res) {
if(req.params.name){//update
return res.render('point', {
title:req.params.name+'|电影|管理|moive.me',
label:'编辑电影:'+req.params.name,
point:req.params.name
});
} else {
return res.render('point',{
title:'新增加|电影|管理|moive.me',
label:'新增加电影',
point:false
});
}
};

/*
var pointTestData={
			"name": "ffff2fsdf",
			"alias": ["Future X-Cops ","Mei loi ging chaat"],
			"publish": "2010-04-29",
			"images":{
			"coverBig":"/img/point/1_big.jpg",
			"coverSmall":"/img/point/1_small.jpg"
			},
			"source":[{
			"source":"优酷",
			"link":"http://www.youku.com",
			"swfLink":"http://player.youku.com/player.php/sid/XMTY4NzM5ODc2/v.swf",
			"quality":"高清",
			"version":"正片",
			"lang":"汉语",
			"subtitle":"中文字幕"
			},{
			"source":"搜狐",
			"link":"http://tv.sohu.com",
			"swfLink":"http://share.vrs.sohu.com/75837/v.swf&topBar=1&autoplay=false&plid=3860&pub_catecode=",
			"quality":"高清",
			"version":"正片",
			"lang":"汉语",
			"subtitle":"中文字幕"
			}]
			};*/

var dopointAdd = function(req, res) {
	
 //console.log("请求内容："+req+'<>point name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=pointTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =pointTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update
} else {//insert
	
 //console.log('调用了dopointAdd方法');

point.save(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/
}
};

exports.pointJSON = function(req, res) {
point.findByName(req.params.name,function(err, obj){
res.send(obj);
});
}




pointrouter.get('/add',pointAdd);//增加
pointrouter.post('/add',dopointAdd);//提交
pointrouter.options('/add',dopointAdd);//提交
pointrouter.get('/:name',pointAdd);//编辑查询

module.exports = pointrouter;