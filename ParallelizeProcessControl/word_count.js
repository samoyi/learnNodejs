const fs = require('fs');

let nCompletedTasks = 0;
    aTasks = [],
    oWordCounts = {},
    sFilesDir = './text';

function checkIfComplete() {
    if (++nCompletedTasks === aTasks.length) {
        for (let index in oWordCounts) { //当所有任务全部完成后，列出文件中用到的每个单词以及用了多少次
            console.log(index +': ' + oWordCounts[index]);
        }
    }
}

function countWordsInText(text) {
    let aWords = text
    .toLowerCase()
    .split(/\W+/)
    .sort();
    aWords.forEach(word=>{
        if(word) {
            oWordCounts[word] = oWordCounts[word] ? oWordCounts[word]+1 : 1;
        }
    });
}

fs.readdir(sFilesDir, (err, files)=>{  //得出text目录中的文件列表
    if (err) throw err;
    files.forEach(file=>{
        var task = (function(file) {  //定义处理每个文件的任务。每个任务中都会调用一个异步读取文件的函数并对文件中使用的单词计数
            return function() {
                fs.readFile(file, 'utf-8', function(err, text) {
                    if (err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                });
            }
        })(sFilesDir + '/' + file);
        aTasks.push(task);  //把所有任务都添加到函数调用数组中
    });

    aTasks.forEach(task=>{task()});
});
