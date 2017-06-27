/**
 * @module 部门人员管理模块
 */
var express = require('express');
var personrouter = express.Router();

//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');
var departmentDAO = require('../dbmodels/departmentDao.js');


/**
 * 人员录入，管理员录入人员
 * @param {json} req - 客户端提交json，例如{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'},"pwd" : "123456"};
 * @param {json} res - 返回，录入成功返回提示成功，失败返回空字符串
 */
var sendpersonimport = function (req, res) {
    var peo = req.body;
    name = peo.name;
    sex = peo.sex,
        nation = peo.nation,
        birthday = peo.birthday,
        idNum = peo.idNum,
        departments = peo.departments;
    if (!name) {
        res.send('名字不能为空')
    }
    if (!idNum) {
        res.send('身份证不能为空')
    } else {
        if (idNum.length != 18) {
            res.send('身份证输入错误')
        }
    }
    if (!departments) {
        //res.send('部门不能为空')
    } else {
        if (!departments.role) {
            res.rend('人员权限不能为空')
        }
    }
    peo.create_date = new Date();
    personDAO.save(peo, function (err, obj) {
        if (err) {
            console.log(err)
        } else {
            console.log('添加成功')
            console.log(obj)
        }
    })
};
//sendpersonimport({
//    "name" : "aaa",
//    "sex":'男',
//    "nation":'汉',
//    "birthday":'1999-11-1',
//    "residence":'住址',
//    "idNum":'123456123456',
//    "departments":[{"type":'1231546413212',role:"权限"}],
//    "title":{job:'职务'},
//    "pwd" : "123456"})

/**
 *使用身份信息注册一个人员
 * @param {json} req 传入人员json数据，例如{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'},"pwd" : "123456"};
 * @param {json} res 返回，注册成功返回提示成功，失败返回空字符串
 */
var sendpersonreGister = function (req, res) {
    var json = req.body;
    //json={"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'},"pwd" : "123456"};
    if (!json) {

    } else {
        //console.log('调用了dopersonAdd方法');
        json.status = 1;
        personDAO.save(json, function (err, obj) {
            if (err) {
                res.send(null);
            } else {
                res.send(obj);
            }
        });
    }
};
/**
 * 用身份证信息验证一个人员是否已经导入,参数必须有身份证
 * @param {json} req - 客户端提交json 例如{"name":"admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号'};
 * @param {json} res - 返回bool值，true：激活用户，false：客户端提示是否需要管理员审核
 */
var sendispersonAdd = function (req, res) {
    //var json=req.body;
    var json = req,
        idNum = json.idNum,
        name = json.name,
        sex = json.sex;
    if (!idNum) {
        //res.send('无效身份证号')
        console.log('无效身份证号')
    } else {
        personDAO.provingperson(idNum, name, sex, function (err, obj) {
            if (err) {
                res.send(err);
            } else {
                //console.log(obj)
                res.send(obj)
            }
        })
    }
};
//sendispersonAdd({'name':'孙建军','idNum':'140702199602101759'})
/**
 * 用身份证信息注册一个待审核人员
 * @param {json} req - 客户端提交json 例如{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'},"pwd" : "123456"};
 * @param {json} res - 返回，注册成功返回提示成功，失败返回空字符串
 */
var sendWaitExamineperson = function (req, res) {
    //status 表示待审核人员
    var json = req.body;
    //json={"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'},"pwd" : "123456"};
    if (!json) {
        res.send('提交为空')
    } else {
        json.status = 4;
        personDAP.save(json, function (err) {
            if (err) {
                res.send(null);
            } else {
                res.send(obj);
            }
        });
    }
};
/**
 * 修改人员状态
 * @param {json} req - 客户端提交json 例如{_id:人员id,status:1}
 * @param {json} res - 返回提示成功
 */
var updatepersonstate = function (req, res) {
    var json = req.body,
    //json=req;
        person = json._id,
        status = json.status;
    if (!person && !status) {
        res.send('信息不全，重新提交')
    }
    personDAO.changePersonStatus(person, status, function (err, obj) {
        if (err) {
            //console.log(null)
            res.send(null);
        } else {
            //console.log(obj)
            res.send(obj)
        }
    })
};
//updatepersonstate({_id:"58e0c199e978587014e67a50",status:9})
/**
 * 根据部门查找人员
 * @param {json} req - 客户端提交json 例如{department:"部门ID"}
 * @param {json} res - 返回json [{_id:'人员ID',"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',images:'',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'}}];
 */
var getdepartmentTopeople = function (req, res) {
    var docID = req.body.department;
    //var docID=req;
    departmentDAO.getPersonsByDepartmentID(docID, function (err, obj) {
        if (err) {
            console.log(null)
            res.send(null)
        } else {
            console.log(obj)
            res.send(obj)
        }
    })
};
//getdepartmentTopeople("58c3a5e9a63cf24c16a50b8c")
/**
 * 根据人员状态，过滤人员,获取某一状态的人员
 * @param {json} req - 客户端提交json 例如{status:1}
 * @param {json} res - 返回json：[{_id:'人员ID',"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',images:'',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'}}];
 */
var getpersonstate = function (req, res) {
    var status = req.body.status;
    if (!status) {
        res.send('状态提交有误，请重新发送')
    }
    personDAO.getpersonstate(status, function (err, obj) {
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};
//getpersonstate({status:9})
/**
 * 查看某一状态的部门，
 * 只查看部门
 * @param {json} req - 客户端提交json 例如{status:1}
 * @param {json} res - 返回json：[{_id:"123456",name:"部门名称",status:1,info:'部门信息'}]
 */
var getdepartmentsstatus = function (req, res) {
    var status = req.body.status;
    if (!status) {
        res.send({error:'状态提交有误，请重新发送'})
    }
    departmentDAO.getpersonstate(status, function (err, obj) {
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};
/**
 * 根据职位获取人员
 * @param {json} req - 客户端提交json 例如{titleID:"123456"}
 * @param {json} res - 返回json：[{_id:'人员ID',"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',images:'',"departments":[{"department":'部门id',role:"权限"}],"title":{job:'职务'}}]
 */
var getPersonsByTitle=function(req,res){
    var title=req.body.titleID;
    //var title=req;
    personDAO.getPersonsByTitle(title,function(err,obj){
        if(err){
            console.log(null)
        }else{
            console.log(obj)
        }
    })
};
//getPersonsByTitle("5952112dea76066818fd6dd0")
/**
 * 部门新建
 * @param {json} req - 传入名称和上级部门id,客户端提交json 例如{name:'新建1',info:'新建描述',parent:'上级部门id',infoLink:'www.baidu.com'}
 * @param {json} res - 返回json：例如{status:1}
 */
var sendnewdepartment = function (req, res) {
    var json = req.body,
        parent = json.personID,
        name = json.name,
        info = json.info,
        infoLink=json.infoLink;
    var newinfo = {};
        newinfo.name=name;
        newinfo.info=info;
        infoLink?newinfo.infoLink=infoLink:newinfo.infoLink=null;
//添加部门是要判断它有没有parent,这个需要在客户端设置
    if (parent) {
        parentDp = departmentDAO.getParent(parent, function (err, dobj) {//取到上级部门id和path
            if (err) {
                console.log(err)
            } else {
                var getpartid=dobj[0];
                newinfo.parent=getpartid._id,
                newinfo.path=getpartid.path,
                    newinfo.status=1;

                departmentDAO.save(newinfo, function (err,nobj) {
                    if (err) {
                        console.log(err)
                    } else {
                        //console.log(nobj)
                        if(getpartid.path){
                            var newpath=getpartid.path+'#'+nobj._id;
                        }else{
                            var newpath=getpartid._id+'#'+nobj._id;
                        }
                        departmentDAO.addparentpath(nobj._id,newpath,function(err,obj){
                            if(err){
                                console.log(err)
                            }else{
                                console.log(obj)
                            }
                        })
                    }
                });

            }
        })
    } else {//insert
        //console.log('调用了dodepartmentAdd方法');
        departmentDAO.save(json, function (err) {
            if (err) {
                res.send({'部门保存出错err': err});
            } else {
                var newobid = department.get("_id");
                // //console.log('新添加部门的id：'+newobid);
                parentDp.add(department);
                parentDp.save();
                res.send({'部门保存success': true});
            }
        });
        /**/
    }
}
//sendnewdepartment({body: {name:'123',info:'ceshi'}})
/**
 * 部门改名
 * @param {json} req - 客户端提交json 例如{status:1}
 * @param {json} res - 返回json：例如{status:1}
 */
var updatedepartmentname = function (req, res) {

}
/**
 * 编辑部门信息，修改名称，描述，官方网站，部门内部的头衔
 * @param {json} req - 客户端提交json 例如{_id:'123456',name:'修改1',info:'修改部门的信息',infoLink:'www.baidu.com',status:1}
 * @param {json} res - 返回json：例如{status:1}
 */
var updatedepartmentinfo = function (req, res) {

}
/**
 * 部门状态管理，修改部门状态
 * @param {json} req - 客户端提交json 例如{_id:'123456',status:1}
 * @param {json} res - 返回json：例如{status:1}
 */
var updatedepartmentstatus = function (req, res) {

}


personrouter.post('/sendpersonimport', sendpersonimport);//提交
module.exports = personrouter;