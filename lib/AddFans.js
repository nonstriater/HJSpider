/**
 * Created by ranwenjie on 17/1/13.
 * 用来添加粉丝
 * eg: hj fans -u 432433 -c 100000 -t 24*60*60
 */

var superagent = require("superagent");
var userDao = require('../dao/UserDao');
var param = require('../utils/param');


var users = [];
var ticking = 0;
var finished = 0;

var targetUid = '';
var targetCount = 0;

/**
 * 给用户添加fans
 * uid: 添加粉丝的uid
 * count: 数量
 * quality: 粉丝质量  low|middle|high
 */
exports.addFansForUser = function (uid, count, quality) {
    //考虑到可能已经关注过,从数据库里去除2倍的人数
    targetUid = uid;
    targetCount = count;
    var q = quality || 'low';
    userDao.queryWithCount(count * 2, q ,function (data) {
        if (!data || (typeof data !== 'object')){
            console.log("api:follow/add: add fans failed! query DB failed");
            return;
        }

        users = data;
        console.log("Get users from DB with count: " + users.length);
        if(users.length > 0){
            console.log("start adding ...");
            _loopFollow();
        }



    });
};

function _loopFollow() {
    if (ticking >= users.length){
        return;
    }
    var oid = users[ticking].user_id;
    _follow(targetUid, oid, function (err) {
        ticking++;
        if (err == null){
            finished++;
            console.log("api:follow/add: add a fans suc! finished = " + finished + ';' + oid + '->' + uid);
            if (finished >= targetCount){
                console.log("api:follow/add:add fans finished! finished = " + finished);
            }
        }

        if (finished < targetCount){
            var delay = param.getRandomInt(0,10);
            setTimeout(_loopFollow(), delay);
        }
    });
}

/*
* 关注一个人
* uid: 被关注人(需要加粉的客户)
* oid: 关注人(fans)
* */
function _follow(uid, oid, callback) {
    var host = "https://passport.huajiao.com";
    var path = "follow/add";

    var deviceid = param.deviceid();
    var netspeed = param.netspeed();
    var network = param.network();
    var version = param.version();
    var platform = param.platform();
    var rand = param.rand();
    var time = param.time();
    var model = (platform.toLowerCase() === 'ios') ? param.ios_model() : param.android_model();
    superagent.get(host + '/' + path)
        .query({"deviceid":deviceid,
            "netspeed":netspeed,
            "network":network,
            "version":version,
            "platform":platform,
            "userid":oid,

            "guid":param.guid(deviceid, netspeed, network, platform, rand, time, oid, version),
            "rand":rand,
            "time":time,

            "dui":deviceid,
            "model":model,
            "channel":(platform.toLowerCase() === 'ios') ? param.ios_channel() : param.android_channel(),
            "uid":uid})
        .accept(param.accept())
        .set('Accept-Encoding',param.acceptEncoding())
        .set('Accept-Language',param.acceptLanguage())
        .set('User-Agent', (platform.toLowerCase() === 'ios') ? param.ios_ua(version, param.ios_deviceName(model), param.ios_osversion()) : param.android_ua() )
        .set('Cookie',param.cookie())
        .end(function(err, res){
            if (err){
                console.log(err);
                callback(err);
                return;
            }
            var errno = res.body.errno;
            if (errno !== 0){
                console.log('api:follow/getUserFollowers failed: errno=' + res.body.errno + ' ;errmsg=' + res.body.errmsg);
                callback({"errno":res.body.errno, "errmsg": res.body.errmsg});
                return;
            }

            callback(null);
        });
}