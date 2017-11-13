var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.setMaxListeners(50);

channel.on('join', function(id, client) {
    var welcome = "Welcome!\n"
              + 'Guests online: ' + this.listeners('broadcast').length;
    client.write(welcome + "\n");

    this.clients[id] = client;  //添加join事件的监听器，保存用户的client对象，以便程序可以将数据发送给用户；

    this.subscriptions[id] = function(senderId, message) {
        if (id != senderId) {  //忽略发出这一广播数据的用户
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);  //添加一个专门针对当前用户的broadcast事件监听器
});

channel.on('leave', function(id) {  //创建leave事件的监听器
   channel.removeListener(
       'broadcast', this.subscriptions[id]);
   channel.emit('broadcast', id, id + " has left the chat.\n");  //移除指定客户端的broadcast监听器
});

channel.on('shutdown', function() {
  channel.emit('broadcast', '', "Chat has shut down.\n");
  channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ':' + client.remotePort;
    channel.emit('join', id, client);   //当有用户连到服务器上来时发出一个`join`事件，指明用户ID和client对象
    client.on('data', function(data) {
        data = data.toString();
        if (data == "shutdown\r\n") {
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data);  //当有用户发送数据时，发出一个频道`broadcast`事件，指明用户ID和消息
    });
    client.on('close', function() {
        channel.emit('leave', id); //在用户断开连接时发出leave事件
    });
});
server.listen(8888);
