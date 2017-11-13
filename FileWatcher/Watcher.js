'use strict';

const events = require('events'),
      util = require('util'),
      fs = require('fs');

util.inherits(Watcher, events.EventEmitter);

function Watcher(watchDir, processedDir) {

    this.watchDir     = watchDir;
    this.processedDir = processedDir;

    let watch = ()=>{
        fs.readdir(this.watchDir, (err, files)=> {//保存对Watcher对象的引用，以便在回调函数readdir中使用
            if (err) throw err;
            files.forEach(file=>{
                this.emit('process', file);  //处理watch目录中的所有文件；
            });
        });
    };

    this.start = function() {    //扩展EventEmitter，添加开始监控的方法
        fs.watchFile(watchDir, ()=>{
            watch();
        });
    }

    this.on('process', (file)=> {
        let watchFile      = this.watchDir + '/' + file;
        let processedFile  = this.processedDir + '/' + file.toLowerCase();
        fs.rename(watchFile, processedFile, function(err) {
            if (err) throw err;
        });
    });
}

module.exports = Watcher;
