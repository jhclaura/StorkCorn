
var Player = function(startX, startZ){
	var x = startX,
		z = startZ,
		id;

	var getX = function(){
		return x;
	};

	var getZ = function(){
		return z;
	};

	var setX = function(newX){
		x = newX;
	};

	var setZ = function(newZ){
		z = newZ;
	};

	return {
		getX: getX,
		getZ: getZ,
		setX: setX,
		setZ: setZ,
		id: id
	}
};

exports.Player = Player;