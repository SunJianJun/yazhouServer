﻿var express = require('express');
var uuid = require('node-uuid');
var fileuploaderroute = express.Router();

var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
// Generate a v1 (time-based) id
//uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'

// Generate a v4 (random) id
//uuid.v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
/* 上传页面 */
//fileuploaderroute.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});



//上传的通用函数
fileuploaderroute.uploadFiles=function(dirName,fName,req, res, next){
	      // //console.log('上传对象uploadFiles已访问到: ' );
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './public/files/'});
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files,null,2);

    if(err){
      // //console.log('file post数据parse error: ' + err);
    //res.write(err);
    } else {
      // //console.log('file post数据中parse files: ' + filesTmp);
      var inputFile = files.inputFile[0];
      var uploadedPath = inputFile.path;
      var dstPath = './public/'+dirName+'/' + fName;
      //重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          // //console.log('fileupload rename error: ' + err);
        } else {
          // //console.log('fileupload rename ok');
        }
      });
      
    res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
    var fileUploadOutputs={
    	//返回原文件名
    	orginName:inputFile.originalFilename,
    	//返回服务器端保存的文件名
    	saveName:fName,
    	//返回服务器端保存路径
    	fileDir:dstPath
    	};
    res.write(fileUploadOutputs);
    }


    res.end("");//util.inspect({fields: fields, files: filesTmp})
 });
	};

/* 上传*/
fileuploaderroute.post('/uploadIcon', function(req, res, next){
	
	fileuploaderroute.uploadFiles("hpImg",uuid.v1(),req, res, next);
});

/* 上传*/
fileuploaderroute.post('/uploadPano', function(req, res, next){
	fileuploaderroute.uploadFiles("pano",uuid.v1(),req, res, next);
   
});

module.exports = fileuploaderroute;
