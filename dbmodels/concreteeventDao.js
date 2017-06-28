var mongodb = require('./mongodb');
var Concreteeventmodule = require('./concreteeventschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
//var abstracttypeDAO = require('./abstracttypeDao'); //抽象类型
//var abstractstepDAO = require('./abstractstepDao'); //抽象步骤

//var concretearguDAO = require('./concretearguDao');//具体参数表
//var concretestepDAO = require('./concretestepDao');//具体步骤表
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:a' + mongodb);
});


//console.log('mongodb Schema:'+Schema);
var Concreteeventmodel = Concreteeventmodule.Concreteeventmodel;
//console.log('mongodb Schema:++'+Concreteeventmodel);
var Personmodel = PersonSchema.Personmodel;

var ConcreteeventDAO = function () {
};
ConcreteeventDAO.prototype.save = function (obj, callback) {
  Concreteeventmodel.create();
  // 终端打印如下信息
  console.log('called Concreteevent save');
  var instance = new Concreteeventmodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Concreteevent' + instance + ' fail:' + err);
    callback(err);
  });
};

ConcreteeventDAO.prototype.findByName = function (name, callback) {
  Concreteeventmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};
ConcreteeventDAO.prototype.getAllConcreteevent=function(callback){//获取所有类型
    var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback getAllConcreteevent 出错：-' + '<>' + err);
    } else {
      console.log('callback getAllConcreteevent 成功：-' + '<>' + obj);
    }
  };
   Concreteeventmodel.find({}).exec(function(err,obj){
     if(err){
       callback(err,null)
     }else{
       callback(null,obj)
     }
   })
}
ConcreteeventDAO.prototype.sendAConcreteevent = function (concreteeventObj, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAConcreteevent 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAConcreteevent 成功：-' + '<>' + obj);
    }
  };
  concreteeventObj.status = 1;
  var newM = new Concreteeventmodel(concreteeventObj);
  newM.save(function (err, uobj) {
    if (err) {
      callback(err, null);
    } else {
      callback(err, uobj);
    }
  });
};
ConcreteeventDAO.prototype.geteventTimestatistics=function(){
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAConcreteevent 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAConcreteevent 成功：-' + '<>' + obj);
    }
  };
}
ConcreteeventDAO.prototype.currentProcessedevents=function(userID,outcallback){
  var callback=outcallback?outcallback:function(err,obj){
    if (err) {
      console.log('callback sendAConcreteevent 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAConcreteevent 成功：-' + '<>' + obj);
    }
  }
}
ConcreteeventDAO.prototype.getMyNewestConcreteevent = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestConcreteevent 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcreteevent 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestConcreteevent 成功：'+'<>');
    }
  };

  var query = Concreteeventmodel.find({'receiver': receiverID, status: 0});
  var opts = [{
    path: 'sender'
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    ,
    select: {name: 1}
  }];
  query.populate(opts);
  // 排序，不过好像对子文档无效
  query.sort({'create_date': 1});//desc asc
  // query.limit(1);

  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs);
    }
    else {
      callback(err, null);
    }
  });
};

ConcreteeventDAO.prototype.getMyNewestConcreteeventFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestConcreteeventFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcreteeventFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestConcreteeventFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Concreteeventmodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
  var opts = [{
    path: 'sender',
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    // ,'images':0
    select: {'name': 1}
  }];
  query.populate(opts);
  // 排序，不过好像对子文档无效
  query.sort({'create_date': 1});//desc asc
  // query.limit(1);

  query.exec(function (err, docs) {
    if (!err) {
      // 如果是需要摘要信息，而且指定来源的消息数量》0
      if (isAbstract && docs.length > 0) {
        var count = docs.length;
        var abstract = docs[docs.length - 1].text ? docs[docs.length - 1].text.substr(0, 6) + '...' : ((docs[docs.length - 1].image || docs[docs.length - 1].video || docs[docs.length - 1].voice) ? '多媒体消息...' : '....');
        var output = {
          sender: docs[docs.length - 1].sender, count: count, abstract: abstract,
          startTime: docs[0].create_date.Format("yyyy-MM-dd hh:mm:ss"),
          lastTime: docs[docs.length - 1].create_date.Format("yyyy-MM-dd hh:mm:ss")
          // ,
          // unreadconcreteevents:docs
        };
        callback(err, output);
      }
      // 如果不需要摘要信息，而且消息数量大于0
      else if (docs.length > 0) {
        callback(err, docs);
      } else {
        // 虽然没有错，但是也没有消息
        callback(err, null);
      }
    }
    else {
    }
  });
};

ConcreteeventDAO.prototype.concreteeventDelete = function (id, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concreteeventDelete 出错：' + '<>' + err);
    } else {
        console.log('callback concreteeventDelete 成功：' + '<>' + obj);
    }
  };
  var query = Concreteeventmodel.remove({'_id': id, status: 1}, {});
  query.exec(function (err, docs) {
    if (!err) {
      // console.log(docs);
      callback(err, docs);
    }
    else {
      console.log('没有数据');
      callback(err, 0);
    }
  });
}
ConcreteeventDAO.prototype.updateaddsetp = function (eventId,step, callback) {
  var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback updateaddsetp 出错：' + '<>' + err);
    } else {
        console.log('callback updateaddsetp 成功：' + '<>' + obj);
    }
  }
  var stepjson=step;
      console.log('--11--')
      console.log(step)

  console.log('--22--')
      Concreteeventmodel.update({_id: eventId}, {$set: {'step':step}}, function (err, res) {
        if (!err) {
          console.log('修改');
          callback(err, res);
        }
        else {
          console.log('没有数据');
          callback(err, 0);
        }
      });
}
ConcreteeventDAO.prototype.geteventStatus = function (status, callback) {
  var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback updateaddsetp 出错：' + '<>' + err);
    } else {
      console.log('callback updateaddsetp 成功：' + '<>' + obj);
    }
  }
  Concreteeventmodel.find({status: status},function (err,obj) {
    if (!err) {
      callback(obj);
    }
    else {
      callback(null);
    }
  });
}

ConcreteeventDAO.prototype.concreteeventpeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concreteeventpeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback concreteeventpeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback concreteeventpeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Concreteeventmodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Concreteeventmodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Concreteeventmodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
          if (!err) {

            console.log('修改');
            console.log(res);
            callback(err, res);
          }
          else {
            console.log('没有数据');
            callback(err, 0);
          }
        });
      }
    }
  });
}

ConcreteeventDAO.prototype.getConcreteeventsInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getConcreteeventsInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getConcreteeventsInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getConcreteeventsInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Concreteeventmodel.find();
  query.or([{
    'receiver': receiverID, sender: senderID, create_date: {
      "$gte": new Date(startTime),
      "$lt": new Date(endtime)
    }
  }, {
    'receiver': senderID, sender: receiverID, create_date: {
      "$gte": new Date(startTime),
      "$lt": new Date(endtime)
    }
  }]);
  var opts = [{
    path: 'sender'
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    // ,'images':0
    ,
    select: {'name': 1}
  }];
  query.populate(opts);
  // 排序，不过好像对子文档无效
  query.sort({'create_date': 1});//desc asc
  // query.limit(1);

  query.exec(function (err, docs) {
    if (!err) {
      // 如果是需要摘要信息，而且指定来源的消息数量》0
      if (docs.length > 0) {
        // var count=docs.length;
        // var abstract=docs[docs.length-1].text?docs[docs.length-1].text.substr(0,6)+'...':(docs[docs.length-1].image?'图片消息...':(docs[docs.length-1].video?'视频消息...':'....'));
        // var output={sender:docs[docs.length-1].sender,count:count,abstract:abstract,
        //     firstTime:docs[0].create_date.Format("yyyy-MM-dd hh:mm:ss"),
        //     lastTime:docs[docs.length-1].create_date.Format("yyyy-MM-dd hh:mm:ss"),
        //     unreadconcreteevents:docs
        // };
        callback(err, docs);
      }
      else {
        // 虽然没有错，但是也没有消息
        callback(err, null);
      }
    }
    else {
    }
  });
};
ConcreteeventDAO.prototype.getpersonEvent=function(personID,callback){ //人员id查询在哪个事件中
  var query=Concreteeventmodel.find({people:{$in:[personID]}});


  query.exec(function(err,obj){
    if(err){
      console.log('查询错误')
      callback(err,null)
    }else{
      callback(null,obj)
    }
  })
}


ConcreteeventDAO.prototype.getMyUnreadConcreteeventsCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadConcreteeventsCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadConcreteeventsCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadConcreteeventsCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Concreteeventmodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};


ConcreteeventDAO.prototype.readtConcreteevent = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtConcreteevent 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtConcreteevent 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtConcreteevent 成功：' + '<>');
    }
  };

  Concreteeventmodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Concreteeventmodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
        console.log(uobj);
        callback(err, uobj);
      });
    }
    else {
      console.log('添加失败');
      callback(err, null);
    }
  });
};
ConcreteeventDAO.prototype.geteventposition=function(callback){
  Concreteeventmodel.find({status:1},'name newer position',function(err,obj){
    if(err){
      callback(err,null)
    }else{
      callback(null,obj)
    }
  })
}



var concreteeventObj = new ConcreteeventDAO();

// concreteeventObj.sendAConcreteevent({
//   type:'无证运营案',
//   name: '摩托车无证运营案',
//   newer: 'null',
//   status:0,
//   step: [
//     {
//       types: '1.立案审批表',
//       status: 1
//     }, {
//       types: '2.现场检查记录',
//       status: 0
//     }, {
//       types: '3.扣押物品',
//       status: 0
//     }, {
//       types: '4.接受调查询问',
//       status: 0
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0
//     }, {
//       types: '6.现场示意图',
//       status: 0
//     }, {
//       types: '7.行政处罚告知',
//       status: 0
//     }, {
//       types: '8.行政处罚决定',
//       status: 0
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0
//     }
//   ]
// });


module.exports = concreteeventObj;