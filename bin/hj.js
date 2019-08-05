#!/usr/bin/env node

var program = require('commander');
var fans = require('../lib/AddFans');

program
    .version('1.0.0')
    .usage('[cmd] <option>')
    .parse(process.argv);

program
    .command('fans [cmd]')
    .alias('f')
    .description('添加粉丝')
    .option('-u, --uid <uid>', '用户uid')
    .option('-c, --count <count>', '添加数量')
    .option('-q --quality [quality]', '粉丝质量')
    .option('-t, --time [time]', '完成时间')
    .action(function (cmd, option) {
        console.log('cmd:'+cmd);
        console.log('option:'+ option);
        var uid = parseInt(option.uid);
        var count = parseInt(option.count);
        if(uid > 0 && count > 0){
            fans.addFansForUser(uid,count,option.quality);
        }
    }).on('-h|--help',function () {
        console.log('  Examples:');
        console.log();
        console.log('    $ hj fans -u 123 -c 10000 -q high');
        console.log();
    });


program.parse(process.argv);