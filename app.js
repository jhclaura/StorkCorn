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
var redPlayer = [];
redPlayer.type = 'addOldPlayer';

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

	//INSERT_TO_WS
	//DOES IT WORK????????
	ws.id = thisId;

	allSockets.push(ws);

	console.log('new player #%d connected!', thisId);	

	ws.on('message', function(data){

		//DEBUG
		// console.log('received: ' + data);

		//TELL_DIFFERENCE
		var msg = JSON.parse(data);

		//ADD_ID_INFO
		//msg.myID = ws.id;

		socketHandlers(ws,msg);

	});

	ws.on('close', function(){
		for(var i=0; i<allSockets.length; i++){

			if(allSockets[i]==ws){
				
				var msg = {
					'type':'removePlayer',
					//'removeID': clientIds[i]
					'removeID': ws.id	//how to get the ID of ws???
				};

				allSockets.splice(i,1);
				clientIds.splice(i,1);
				redPlayer.splice(i,1);

				socketHandlers(ws,msg);

				console.log('Client #%d disconnected.', thisId);
				break;
			}
		}
	});


});


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



var socketHandlers = function(socket,msg){


	//GENERAL_SENDING_DATA
	for(var i=0; i<allSockets.length; i++){
		try{
			// //ADD_ID_INFO
			msg.myID = socket.id;
			// console.log('msg.myID = socket.id -->' + socket.id);

			// MEG_FROM_PointerLockControls
			if(msg.type=='addNewPlayer'){

				//GENERATE_RED_STORK_ONLY_ONCE
				if(msg.camID==0){
					msg.npID = socket.id;
					console.log('newPlayerID -->' + socket.id);
					msg.camID++;
					// console.log('camID -->' + msg.camID);

					redPlayer.push(msg);
				}
			}

			allSockets[i].send(JSON.stringify(msg));
			// console.log('Server sent a GENERAL thing.');

			if(msg.type=='addNewPlayer'){
				allSockets[i].send(JSON.stringify(redPlayer));
				// console.log('Server sent a BROADCAST thing.');				
				console.log(redPlayer.length);
			}

		}
		catch(error){
			console.log('that socket was closed');
		}
	}


	//BROADCAST_HISTORY_OF_PLAYERS
	// for(var i=0; i<allSockets.length; i++){
	// 	try{

	// 		// MEG_FROM_PointerLockControls
	// 		if(msg.type=='addNewPlayer'){

	// 			//console.log('addNewPlayer: #' + );

	// 			// msg.newPlayerID = clientIds[i];
	// 			//msg.newPlayerID = msg.myID;

	// 			//GENERATE_RED_STORK_ONLY_ONCE
	// 			if(msg.camID==0){
	// 				msg.npID = socket.id;
	// 				console.log('newPlayerID -->' + socket.id);


					
	// 				msg.camID++;
	// 				// console.log('camID -->' + msg.camID);


	// 				redPlayer.push(msg);
	// 			}

	// 			// console.log(redPlayer);

	// 			//allSockets[i].send(JSON.stringify(msg));

	// 			allSockets[i].send(JSON.stringify(redPlayer));

	// 			// console.log('Server sent a BROADCAST thing.');				
	// 			console.log(redPlayer.length);
	// 		}
	// 	}
	// 	catch(error){
	// 		console.log('that socket was closed');
	// 	}
	// }

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
