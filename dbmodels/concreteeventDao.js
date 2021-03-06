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
ConcreteeventDAO.prototype.getAllConcreteevent=function(depar,status,outcallback){//获取所有类型
    var callback=outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getAllConcreteevent 出错：-' + '<>' + err);
    } else {
      console.log('callback getAllConcreteevent 成功：-' + '<>' + obj);
    }
  };
   Concreteeventmodel.find({department:depar,status:status}).exec(function(err,obj){
     if(err){
       callback(err,null)
     }else{
       callback(null,obj)
     }
   })
};

ConcreteeventDAO.prototype.getConcreteeventtotype=function(depar,type,callback){//获取所有类型
  var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback getAllConcreteevent 出错：-' + '<>' + err);
    } else {
      console.log('callback getAllConcreteevent 成功：-' + '<>' + obj);
    }
  };
  Concreteeventmodel.find({department:depar,type:type,status:1}).exec(function(err,obj){
    if(err){
      callback(err,null)
    }else{
      callback(null,obj)
    }
  })
};
//新建一个事件
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
      callback(err);
    } else {
      callback(null, uobj);
    }
  });
};

//
ConcreteeventDAO.prototype.geteventTimestatistics=function(){
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAConcreteevent 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAConcreteevent 成功：-' + '<>' + obj);
    }
  };
};

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


ConcreteeventDAO.prototype.concreteeventDelete = function (id, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concreteeventDelete 出错：' + '<>' + err);
    } else {
        console.log('callback concreteeventDelete 成功：' + '<>' + obj);
    }
  };
  var query = Concreteeventmodel.update({'_id': id}, {status:0});
  query.exec(function (err, docs) {
    if (!err) {
      // console.log(docs);
      callback(null, docs);
    }
    else {
      console.log('没有数据');
      callback(err);
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
      //console.log(step)
      Concreteeventmodel.update({_id: eventId}, {$set: {'step':step}}, function (err, res) {
        if (!err) {
          //console.log('修改');
          callback(err, res);
        }
        else {
          console.log('没有数据');
          callback(err, 0);
        }
      });
}
ConcreteeventDAO.prototype.updateeventstatus = function (eventId,status, callback) {
  var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback updateaddsetp 出错：' + '<>' + err);
    } else {
      console.log('callback updateaddsetp 成功：' + '<>' + obj);
    }
  }
  Concreteeventmodel.update({_id: eventId}, {status:status}, function (err, res) {
    if (!err) {
      callback(null, res);
    }
    else {
      console.log('没有数据');
      callback(err, 0);
    }
  });
}
ConcreteeventDAO.prototype.getnewcurrentexamineevent = function (departemnt,type,callback) {
  Concreteeventmodel.find({department: departemnt,type:type}, function (err, res) {
    if (res){
      callback(null, res);
    }
    else {
      callback(err);
    }
  });
}
ConcreteeventDAO.prototype.geteventStatus = function (status, outcallback,department) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback updateaddsetp 出错：' + '<>' + err);
    } else {
      console.log('callback updateaddsetp 成功：' + '<>' + obj);
    }
  }
  var ops={status: status};
  if(department){ops.department=department;}
  Concreteeventmodel.find(ops,function (err,obj) {
    if (!err) {
      callback(null,obj);
    }
    else {
      callback(err);
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

ConcreteeventDAO.prototype.getpersonEvent=function(personID,type,callback){ //人员id查询在哪个事件中
  var ops={people:{$in:[personID]},status:1};
  if(type){
    ops.type=type;
  }
  var query=Concreteeventmodel.find(ops);
  query.exec(function(err,obj){
    if(err){
      callback(err,null)
    }else{
      callback(null,obj)
    }
  })
}

ConcreteeventDAO.prototype.geteventtoidarr=function(id,callback){ //人员id查询在哪个事件中
  var query=Concreteeventmodel.find({_id:{$in:id}});
  query.exec(function(err,obj){
    if(err){
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
ConcreteeventDAO.prototype.geteventposition=function(dep,callback){
  ops={};
  if(dep){ops.department={$in:dep}}
  Concreteeventmodel.find(ops,'name newer position status',function(err,obj){
    if(err){
      callback(err,null)
    }else{
      callback(null,obj)
    }
  })
}

ConcreteeventDAO.prototype.getIncompletesteps=function(ID,callback){
  Concreteeventmodel.findOne({_id:ID},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}
//修改事件更新日期
ConcreteeventDAO.prototype.sendeventnewer=function(ID,callback){
  console.log('日期更新'+ID)
  Concreteeventmodel.update({_id:ID},{newer:new Date()},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}
//事件添加参与人员修改事件更新日期
ConcreteeventDAO.prototype.sendeventperson=function(ID,person,callback){
  Concreteeventmodel.findOne({_id:ID},function (ferr,fobj) {
    if(fobj){
      //for(var i=0,isyou=false;i<fobj.people.length;i++){
      //  fobj.people[i]==person){
      //    // console.log('存在相同的人')
      //    isyou=true;
      //  }
      //}
      var ops={newer:new Date()};
      ops.newerperson=person;
      console.log(fobj.people.indexOf(person)+1)
      if(fobj.people.indexOf(person)+1){
        fobj.people.push(person);
        ops.people=fobj.people;
        ops.newerperson=person;
      }
      //if(!isyou){
      //}
      Concreteeventmodel.update({_id:ID},ops,function(err,obj){
        if(err){
          callback(err)
        }else{
          callback(null,obj)
        }
      })
    }else{
      callback(err)
    }
  })
}
ConcreteeventDAO.prototype.geteventlaseperson=function(dep,outcallback){
  var callback=outcallback?outcallback: function(err, obj) {
      console.log('根据事件获取：'+'err:'+err+'obj:'+obj);
      console.dir(obj);
    }

}


var concreteeventObj = new ConcreteeventDAO();


module.exports = concreteeventObj;