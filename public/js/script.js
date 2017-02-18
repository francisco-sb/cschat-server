jQuery(function($) {
	var socket = io.connect();
	var messageForm = $('#sendMessage');
	var message = $('#message');
	var chat = $('#chat');

	var nickname = $('#nickname');
	var setNick = $('#setNick')
	var users = $('#users');

	setNick.click(function(e){
		e.preventDefault();
		socket.emit('newUser', nickname.val(), function(data){
			if (data){
				$('#nickContainer').hide();
				$('#content').show();
			} else {
				$('#login-error').show();
			}
		});
	});

	messageForm.submit(function(e) {
		e.preventDefault();
		if (message.val()!='') socket.emit('sendMessage', message.val());
		message.val('');
	})

	socket.on('newMessage', function(data) {
		chat.append(data.nick + ': ' + data.msg + "<br/>");
	});

	socket.on('usernames', function(data){
		var usernamesString = "";
		for(var username in data){
			usernamesString+= username + "<br/>";
		}
		users.html(usernamesString);
	});

});
