var express = require('express');
var pug = require('pug');
var path = require('path');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var nicknames = {};

/*app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));*/

//sockets
io.sockets.on('connection', function(socket){

	socket.on('disconnect', function(data){
		if (!socket.nickname) return;
	    console.log('Username desconectado: ' + socket.nickname + " - ID: " + socket.id);
			socket.broadcast.emit('newMessage', 'offline',socket.nickname+' se ha desconectado del chat.');
	    delete nicknames[socket.nickname];
	    updateNickNames();
	});

	socket.on('newUser', function(data, callback){

		if (data in nicknames) {
			callback(false);
		} else {
			callback(true);
			socket.nickname = data;

			nicknames[data] = socket.id;
			updateNickNames();
			console.log('Username conectado: ' + socket.nickname + " - ID: " + socket.id);
			socket.emit('newMessage','online','Bienvenido al chat '+socket.nickname)
			socket.broadcast.emit('newMessage','online',socket.nickname+' se ha conectado al chat.');
		}
	});

	//Aquí se envía el mensaje al usuario correspondiente
	socket.on('sendMessage', function(to,fromuser,fromid,data){
		console.log(to,fromuser,fromid,data);

		if (to == 'chatroom') {
			io.sockets.emit('newMessage','message',{msg: data, fromuser: fromuser, to: to});
		}else {
			io.to(to).emit('newMessage', 'privateMessageTo', {msg: data, fromuser: fromuser, fromid: fromid, to: to});
			io.to(fromid).emit('newMessage', 'privateMessageFrom', {msg: data, fromuser: fromuser, fromid: fromid, to: to});
			console.log(fromuser,fromid);
		}

	});

	function updateNickNames(){
		io.sockets.emit('usernames', nicknames);
	}

	/*socket.on('check_user', function(asker, id){
		io.to(usernames[asker]).emit('msg_user_found', check_key(id));
	});*/
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});

/*
server.listen(process.env.PORT, process.env.IP);
*/
