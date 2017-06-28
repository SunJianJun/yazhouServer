/**
 * @module 地图功能模块 url: /maproute
 */
var express = require('express');
var map = express.Router();

//获取数据模型
var person = require('../dbmodels/personDAO.js');
var spotareaDAO = require('../dbmodels/spotareaDao');
var concreteeventDao=require('../dbmodels/concreteeventDao');


/**
 * 上传制作网格区域
 * @param {json} req - 传入绘制网格json数据，例如{geometry:{coordinates:["116.430587","39.909989”,"116.430587","39.899989,"116.446587","39.899989","116.446587","39.909989"],type:"Polygon"},name:"区域命名",type:"市场"}
 * @param {json} res - 返回成功后的json 例如：{_id: "594f747ebdd246cc3b482c90",geometry:{coordinates:["116.430587","39.909989”,"116.430587","39.899989,"116.446587","39.899989","116.446587","39.909989"],type:"Polygon"},name:"区域命名",type:"市场",status:1,persons:[]}
 */
var sendASpotarea=function(req,res){

    var datt=req.body;
    if(!datt){return;}
    spotareaDAO.sendASpotarea(datt,function( err,obj){
        if(!err) {
            console.log('sendASpotarea 查询所有发送的消息:'+obj._id);
            res.send(obj);
        } else{
            console.log('sendASpotarea 查询所有发送的消息为空:'+err);
            res.send(null);
        }});
}
/**
 * 进行网格和人员绑定
 * @param {json} req - 客户端提交json 例如{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'},"pwd" : "123456"};
 * @param {json} res - 返回bool值，true：激活用户，false：客户端提示是否需要管理员审核
 */
var addperson=function(req,res){
    var eve=req.body;
    // console.log(name);
    // 调用方法
    // spotareaObj.getSpotareasInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('messID:'+messID);
    spotareaDAO.sendPersontarea(eve,function( err,obj){
        if(!err) {
            // console.log('没有错误')
            console.log('sendPersontarea 查询所有'+eve+'发送的消息:'+obj);
            // console.log(obj);
            res.send(eve);
        } else{
            console.log('sendPersontarea 查询所有'+eve+'发送的消息为空:'+err);
            res.send(null);
        }});
};
/**
 * 图层数据配置<br/>
 * 修改图层信息，名称和范围
 * @param {json} req - 客户端提交JSON 例如{“_id”:"图层ID",name:"南六环",geometry:{coordinates:["116.430587","39.909989”,"116.430587","39.899989","116.446587","39.899989","116.446587","39.909989"],type:"Polygon"}}
 * @param {json} res - 成功返回提示,失败返回空
 */
var updatespotarea=function(req,res){
    var date=req.body;
    var _id=date._id,
        name=date.name,
        coordinates=date.geometry;
    spotareaDAO.updateASpotarea(_id,name,coordinates,function(err,obj){
        if(err){
            res.send(null)
        }else{
            res.send(obj)
            //res(obj)
        }
    })
};
/**
 * 地图显示配置
 * 选择显示同事，代办案件，网格区域，摄像头
 * @param {json} req - 客户端提交JSON 例如{“person“:true,"case":false,"area":true,"camera":false}
 * @param {json} res - 返回json ，例如[{_id:"12345612",name:"南六环",persons:[{_id:"123456",name:"张三"},geometry:{coordinates:["116.430587","39.909989”,"116.430587","39.899989","116.446587","39.899989","116.446587","39.909989"]}}]<br/>case:true,加入{_id:"案件ID",name:"无照经营"}
 */
var getmapdisplaysetting=function(req,res){

};
/**
 * 待办事件坐标点
 * @param {} req - 请求地址，无需传参
 * @param {json} res - 返回json ，例如[{_id:"事件ID",name:"无照经营",position:["116.446587","39.909989"],newer:"更新时间"}]
 */
var geteventposition=function(req,res){
    concreteeventDao.geteventposition(function(err,obj){
        if(err){
            res.send(null)
        }else{
            res.send(obj)
        }
    })
};
/**
 * 获取网格区域
 * @param {} req - 请求地址，无需传参
 * @param {json} res - 返回json ，例如[{“_id”:"网格区域ID",name:"南六环",geometry:{coordinates:["116.430587","39.909989”,"116.430587","39.899989","116.446587","39.899989","116.446587","39.909989"],type:"Polygon"}}]
 */
var getspotarea=function(req,res){
    spotareaDAO.getNewestSpotarea(function( err,obj){
        if(!err) {
            res.send(obj);
        } else{
            // //console.log('getNewestSpotarea 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }
    });
}
/**
 * 获取同部门人员的信息
 * @param {json} req - 客户端提交JSON 例如{_id:"当前人员ID"}
 * @param {json} res - 返回json ，例如[{_id:"同事ID",name:"张三",position:["116.446587","39.899989"],status:1}]
 */
var getworkmateinfo=function(req,res){

}
/**
 * 获取摄像头位置
 * @param {} req - 请求地址，无需传参
 * @param {json} res - 返回json ，例如[{location：[109，38]，videoUrl：video.sohu.com，name：“保平村路口”，type："球形摄像头"，protocol：“rstp”}]
 */
var getcameraposition=function(req,res){

};

map.post('/sendASpotarea',sendASpotarea);//提交
module.exports = map;