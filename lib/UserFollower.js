/**
 * Created by ranwenjie on 17/1/13.
 * 用来抓取用户信息,存入数据库
 */

var superagent = require("superagent");
var userDao = require('../dao/UserDao');
var param = require('../utils/param');

var uid = "21076928";//宋仲基 //"59819854";//冰冰uid
var num = 200;
var offset = 5959775;//10128089/10125798/10123496?
var page = 1;

exports.start = function () {
    _start();
};

function _start() {
    console.log("\n\n\nfetch user, page offset = " + offset + ' ,page = ' + page);
    _getUserFollowers(uid, offset, num, function (err, param) {
        if (err) return;
        if (typeof param === 'string'){
            offset = parseInt(param);
            page ++;
            _start();
        }
    })
}

function _getUserFollowers(uid, offset, num, callback) {
    var host = "https://passport.huajiao.com";
    var path = "follow/getUserFollowers";

    var deviceid = param.deviceid();
    var netspeed = param.netspeed();
    var network = param.network();
    var version = param.version();
    var currentUid = param.currentUid();
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
            "userid":currentUid,

            "guid":param.guid(deviceid, netspeed, network, platform, rand, time, currentUid, version),
            "rand":rand,
            "time":time,

            "dui":deviceid,
            "model":model,
            "channel":(platform.toLowerCase() === 'ios') ? param.ios_channel() : param.android_channel(),

            "uid":uid,
            "num":num,
            "offset":offset})
        .accept(param.accept())
        .set('Accept-Encoding',param.acceptEncoding())
        .set('Accept-Language',param.acceptLanguage())
        .set('User-Agent', (platform.toLowerCase() === 'ios') ? param.ios_ua(version, param.ios_deviceName(model), param.ios_osversion()) : param.android_ua() )
        .set('Cookie',param.cookie())
        .end(function(err, res){
            if (err){
                console.log(err);
                callback(err, null);
                return;
            }
            var errno = res.body.errno;
            if (errno !== 0){
                console.log('api:follow/getUserFollowers failed: errno=' + res.body.errno + ' ;errmsg=' + res.body.errmsg);
                callback(null,null);
                return;
            }

            var data = res.body.data;
            _saveUsers(data.users);

            var more = data.more;
            if (more){
                var offset = data.offset;
                var sec = param.getRandomInt(0,60);
                setTimeout(callback(null,offset), sec * 1000);
            }else{
                console.log("api:follow/getUserFollowers: no more fans!");
            }
        });
}

function _saveUsers(data) {
    if (!data || typeof data !== 'object') return;
    console.log("insert users to db");
    userDao.addUsers(data);
}



