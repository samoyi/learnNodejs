const http = require('http');
const fs = require('fs');

let server = http.createServer(function (req, res) { //客户端请求一开始会进到这里
    getTitles(res);  //控制权转交给了getTitles
}).listen(8000);





function getTitles(res) {  //获取标题，并将控制权转交给getTemplate
    fs.readFile('./titles.json', 'utf-8', function (err, data) {
        if (err) {
            hadError(err, res);
        }
        else {
            getTemplate(JSON.parse(data), res);
        }
    })
}

function getTemplate(titles, res) {  //读取模板文件，并将控制权转交给formatHtml
    fs.readFile('./template.html', 'utf-8', function (err, data) {
        if (err) {
            hadError(err, res);
        }
        else {
            formatHtml(titles, data, res);
        }
    })
}

function formatHtml(titles, tmpl, res) {  //formatHtml得到标题和模板，渲染一个响应给客户端
    let html = tmpl.replace('%', titles.join('</li><li>'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
}

function hadError(err, res) {  //如果这个过程中出现了错误，hadError会将错误输出到控制台，并给客户端返回“Server Error”
    console.error(err);
    res.end('Server Error');
}
