//SET_UP

//NODE.JS_REQUIRE
var express = require('express');
var app = express();
//
var util = require('util');
var Player = require('./Player').Player;


var http = require('http');
var server = http.createServer(app);

var port = process.env.PORT || 8000;

//VARIABLES
var players = [];

//

server.listen(port);

app.get('*', function(req, res){
	res.sendfile(__dirname + req.url);
});

console.log('Server started on port ' + port);


//


var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer( {'server': server} );

var allSockets = [];	//for all sockets/clients
//
var clientIds = [];
var thisId = 0;

wss.on('connection', function(ws){
	thisId++;
	clientIds.push(thisId);
	allSockets.push(ws);
	console.log('new player #%d connected!', thisId);
	//GENERATE_RED_STORK_AS_PLAYER
	

	ws.on('message', function(data){

		//DEBUG
		// console.log('received: ' + data);

		//TELL_DIFFERENCE
		var msg = JSON.parse(data);
		socketHandlers(ws,msg);

		// if(msg.type == 'updatePlayer'){

		// }


		// for(var i=0; i<allSockets.length; i++){
		// 	try{
		// 		allSockets[i].send(data);
		// 	}
		// 	catch(error){
		// 		console.log('that socket was closed');
		// 	}
		// }
	});

	ws.on('close', function(){
		for(var i=0; i<allSockets.length; i++){
			if(allSockets[i]==ws){
				
				var msg = {
					'type':'removePlayer',
					'removeID': clientIds[i]
				};
				allSockets.splice(i,1);
				clientIds.splice(i,1);
				// redPlayer.splice(i,1);

				socketHandlers(ws,msg);

				console.log('Client #%d disconnected.', thisId);
				break;
			}
		}
	});


});

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

var redPlayer = [];

var socketHandlers = function(socket,msg){

	//GENERAL_SENDING_DATA
	for(var i=0; i<allSockets.length; i++){
		try{
			msg.myID = clientIds[i];
			allSockets[i].send(JSON.stringify(msg));

		}
		catch(error){
			console.log('that socket was closed');
		}
	}

	//RESTORE_PLAYER_HISTORY
	for(var i=0; i<allSockets.length; i++){
		try{
			if(msg.type=='addNewPlayer'){

				if(msg.camID==0){
					redPlayer.push(msg);
					msg.camID++;
				}

				allSockets[i].send(JSON.stringify(redPlayer));				
				console.log(redPlayer.length);
			}
		}
		catch(error){
			console.log('that socket was closed');
		}
	}

	//RESTORE_AddStork
	// for(var i=0; i<allSockets.length; i++){

	// 	try{
	// 		if(msg.type=='addNewPlayer'){

	// 			if(msg.camID==0){
	// 				redPlayer.push(msg);
	// 				msg.camID++;
	// 			}

	// 			allSockets[i].send(JSON.stringify(redPlayer));				
	// 			console.log(redPlayer.length);
	// 		}
	// 	}
	// 	catch(error){
	// 		console.log('that socket was closed');
	// 	}

	// }
};

// var socketHandlers = {
// 	'addStork': function(socket,msg){
// 		for(var i=0; i<allSockets.length; i++){
// 			try{
// 				allSockets[i].send(JSON.stringify(msg));
// 			}
// 			catch(error){
// 				console.log(error);
// 			}
// 			break;
// 		}
// 	}
// };
