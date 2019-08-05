
var utils = require('utility');


////////////////////////////////////
/*基本信息*/
exports.deviceid = function(){
    var arr = ["5c030e592b47852bebe7e3e07662e06a"];
    return arr[0];
};

exports.network = function () {
    var arr = ["Wi-Fi"];
    return arr[0];
};

exports.netspeed = function () {
    var arr = [0];
    return arr[0];
};

exports.version = function () {
    var arr = ["3.9.0"];
    return arr[0];
};

////////////////////////////////////
/*平台相关,分iOS、android*/
exports.platform = function () {
    var arr = ["ios","android"];
    return arr[0];
};

exports.ios_model = function () {
    var arr = [
        "iPhone7,1",
        "iPhone7,2",
        "iPhone8,1",
        "iPhone8,2",
        "iPhone6,2"
    ];
    return arr[0];
};

exports.ios_deviceName = function (model) {
    var json = {
        "iPhone7,1":"iPhone 6 Plus",
        "iPhone7,2":"iPhone 6",
        "iPhone8,1":"iPhone 6s",
        "iPhone8,2":"iPhone 6s Plus",
        "iPhone6,2":"iPhone 5S"
    };
    return json['model'];
};

exports.ios_deviceScale = function (device) {
    if (device === 'iPhone 6 Plus' || device === 'iPhone 6s Plus'){
        return "3.00";
    }
    return "2.00";
};

exports.android_model = function () {
    var arr = [""];
    return arr[0];
};

exports.android_deviceName = function () {
    var arr = [""];
    return arr[0];
};


exports.ios_osversion = function () {
    var arr = [
        "9.3.2",
        "9.3.5",
        "9.3.4",
        "9.3.1",
        "9.2.1",
        "9.3.3",
        "9.2"];
    return arr[0];
};

exports.android_osversion = function () {
    var arr = [
        "9.3.2"
    ];
    return arr[0];
};

exports.ios_channel = function () {
    var arr = ["Apple"];
    return arr[0];
};

exports.android_channel = function () {
    var arr = ["Apple"];
    return arr[0];
};

//"living/3.9.0(iPod touch;iOS8.4;Scale/2.00)"
exports.ios_ua = function (version, deviceName, osversion) {
    return "living/" + version + '(' + deviceName + ';iOS' + osversion + ';Scale/'+ this.ios_deviceScale(deviceName)  + ')';
};

exports.android_ua = function () {
    var arr = ["living/3.9.0(iPod touch;iOS8.4;Scale/2.00)"];
    return arr[0];
};

////////////////////////////////////
/*固定*/
exports.accept = function () {
    return "*/*";
};

exports.acceptEncoding = function () {
    return "gzip";
};

exports.acceptLanguage = function () {
    return "zh-Hans;q=1";
};


////////////////////////////////////
/*校验相关*/
exports.guid = function (deviceid, netspeed, network, platform, rand, time, userid, version) {
    var salt = "eac63e66d8c4a6f0303f00bc76d0217c";
    var str = "deviceid="+deviceid+
        "netspeed="+netspeed+
        "network="+network+
        "platform="+platform+
        "rand="+rand+
        "time="+time+
        "userid="+userid+
        "version="+version+
        salt;
    return utils.md5(str);
};

exports.time = function () {
    var milliseconds = Date.parse(new Date());
    return milliseconds / 1000;
};

exports.getRandomInt = function(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor( Math.random()*(max - min) + min);
};

exports.rand = function () {
    return this.getRandomInt(0, Math.pow(10, 9)*2);
};

////////////////////////////////////
/*当前用户uid*/
exports.currentUid = function () {
    return "22934469";
};

exports.cookie = function () {
    return "token=02015df3c55882e8a5ac3fd0y5aJHdAX4eT3082a";
};