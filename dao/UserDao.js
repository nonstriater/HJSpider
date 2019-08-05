/**
 * Created by ranwenjie on 17/1/14.
 */

var mysql = require('mysql');
var conf = require('../conf/mysql-conf');
var util = require('../utils/param');

var pool = mysql.createPool(conf.mysql);

exports.add = function (user, callback) {
    if (!user || typeof user !== 'object') return;

    pool.getConnection(function (err, connection) {
        if(err) return;
        var sql = 'replace into user(user_id,nickname,source,astro,avatar,gender,level,location,signature,exp,' +
            'latest_feed,followers_count,followings_count,tags,feeds_count,praises_count,' +
            'total_send,total_receive) ' +
            'values (?,?,?,?,?,?,?,?,?,?' +
            '?,?,?,?,?,?,' +
            '?,?)';
        var params = [user.uid,user.nickname];
        sql = mysql.format(sql, params);
        connection.query(sql, function (err, result, fields) {
            if (err){
                console.log('add err:'+ err );
                return;
            }
            callback(result);
        });
        connection.release();
    })
};

exports.addUsers = function (users) {
    if (!users || typeof users !== 'object') return;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('getConnection err:'+ err );
            return;
        }
        connection.beginTransaction(function (err) {
            if(err) return;
            var length = users.length;
            for (var index = 0; index < length; index++){
                var user = users[index];
                if (typeof user !== 'object') continue;
                //如果用户已经存在,更新用户数据
                var sql = 'replace into user(user_id,nickname,source,astro,avatar,gender,level,location,signature,exp,' +
                    'latest_feed,followers_count,followings_count,tags,feeds_count,praises_count,' +
                    'total_send,total_receive) ' +
                    'values (?,?,?,?,?,?,?,?,?,?, ' +
                    '?,?,?,?,?,?,' +
                    '?,?)';
                var params = [
                    user.uid,
                    user.nickname,
                    user.source,
                    user.astro,
                    user.avatar,
                    user.gender,
                    user.level,
                    user.location,
                    user.signature,
                    user.exp,

                    JSON.stringify(user.feed),
                    user.followers,
                    user.followings,
                    "",
                    0,
                    user.praises,

                    0,
                    0];
                sql = mysql.format(sql, params);
                connection.query(sql, function (err, result, fields) {
                    if (err){
                        console.log('insert user err:'+ err );
                    }
                });
            }

            connection.commit(function (err) {
                if(err){
                    console.log('add users failed:' + err);
                }

                connection.release();
            })
        });

    })
};

exports.queryWithCount = function (count, quality, callback) {
    if(count <= 0) return;
    var q = quality || 'low';

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('getConnection err:'+ err );
            return;
        }

        var condition = '';
        if (q === 'low'){
            condition = 'level < 5';
        }else if(q === 'middle'){
            condition = 'level > 2 and level <10';
        }else if (q == 'high'){
            condition = 'level >= 10';
        }

        offset = util.getRandomInt(0, Math.pow(10,4));
        var sql = 'select user_id from user where ' + condition + ' limit ' + offset + ',' + count;
        connection.query(sql, function (err, result, field) {
            if (err){
                console.log('query user err:'+ err );
                return;
            }

            callback(result);
        });
    })
};

exports.queryWithUid = function (uid , callback) {

};

exports.update = function (uid, user, callback) {

};

exports.remove =function (uid) {
    
};
