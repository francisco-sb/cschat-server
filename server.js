var express = require('express');
var pug = require('pug');
var path = require('path');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

const port = process.env.PORT || 3000 //se asigna el puerto

var nicknames = {}; //arreglo de usuarios

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//app.use(express.static(path.join(__dirname, 'public')));

//sockets, evento connection
io.sockets.on('connection', function(socket){

	//evento disconnect
	socket.on('disconnect', function(data){
		if (!socket.nickname) return;
	    console.log('Username desconectado: ' + socket.nickname + " - ID: " + socket.id);

			//broadcast emite el msj a todos los sockets menos el que genera el evento
			socket.broadcast.emit('newMessage', 'offline',socket.nickname+' se ha desconectado del chat.');
	    delete nicknames[socket.nickname]; //se elimina al usuario del arreglo
	    updateNickNames();
	});

	//evento newUser
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

	//Evento sendMessage, Aquí se envía el mensaje al usuario correspondiente
	//se reciben 5 parámetros, el evento, los usuarios involucrados y el msj
	socket.on('sendMessage', function(to,fromuser,fromid,data){
		console.log(to,fromuser,fromid,data);

		if (to == 'chatroom') {
			io.sockets.emit('newMessage','message',{msg: data, fromuser: fromuser, to: to});
		}else {
			//se utiliza io.to(id) para enviar el msj privado según el id
			io.to(to).emit('newMessage', 'privateMessageTo', {msg: data, fromuser: fromuser, fromid: fromid, to: to});
			io.to(fromid).emit('newMessage', 'privateMessageFrom', {msg: data, fromuser: fromuser, fromid: fromid, to: to});
			//se hace dos veces para que el usuario que mandó el msj privado también pueda ver su msj

			console.log(fromuser,fromid);
		}

	});

	//función que permite emitir a los usuarios todos los usuarios que están conectados
	function updateNickNames(){
		io.sockets.emit('usernames', nicknames);
	}

});

server.listen(port, function(){
	console.log('listening on *: '+port);
});

/*
server.listen(process.env.PORT, process.env.IP);
*/
