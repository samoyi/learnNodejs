const http = require('http');　
const fs   = require('fs');
const path = require('path');
const mime = require('mime');
let cache = {};  // cache file content


let server = http.createServer(function(request, response) {
    let filePath = null;
    if (request.url == '/') {
        filePath = 'public/index.html';
    }
    else {
        filePath = 'public' + request.url; // Convert the URL to relative path to this file
    }

    let absPath = './' + filePath;
    serveStatic(response, cache, absPath);  // Return statis file
});


server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});






function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {"content-type": mime.getType(path.basename(filePath))} );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {  // Check if the file is cached in memory
        sendFile(response, absPath, cache[absPath]);  // Reture file from memory
    }
    else {
        fs.exists(absPath, function(exists) {  // Check if the file exists
            if (exists) {
                fs.readFile(absPath, function(err, data) {  // Get file from disk
                    if (err) {
                        send404(response);
                    }
                    else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);  // Return file
                    }
                });
            }
            else {
                send404(response);
            }
        });
    }
}
