const fs = require('fs');

let configFilename = './url.txt';

function checkForURLFile () { //任务1：确保包含RSS预订源URL列表的文件存在
    if( fs.existsSync(configFilename) ){
        next(null, configFilename);
    }
    else{
        return next(new Error('Missing URL file: ' + configFilename)); //只要有错误就尽早返回
    }
}

function readRSSFile (configFilename) {  //任务2：读取并解析包含预订源URL的文件

    fs.readFile(configFilename, 'utf-8', function(err, feedList) {

        if (err) return next(err);
        feedList = feedList  //将预订源URL列表转换成字符串，然后分隔成一个数组
        .replace(/^\s+|\s+$/g, '')
        .split("\n");
        let random = Math.floor(Math.random()*feedList.length);  //从预订源URL数组中随机选择一个预订源URL
        next(null, feedList[random]);
    });
}

function downloadRSSFeed (feedUrl) {  //任务3：向选定的预订源发送HTTP请求以获取数据
    console.log('1 ' + feedUrl);
    next(null, feedUrl);
}

function parseRSSFeed (rss) {  //任务4：将预订源数据解析到一个条目数组中
    console.log('2 ' + rss);
}

let tasks = [ checkForURLFile,  //把所有要做的任务按执行顺序添加到一个数组中
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed ];


function next(err, result) {  //如果任务出错，则抛出异常
    if (err) throw err;  //负责执行任务的next函数

    var currentTask = tasks.shift();  //从任务数组中取出下个任务

    if (currentTask) {
        currentTask(result);  //执行当前任务
    }
}
next();  //开始任务的串行化执行
