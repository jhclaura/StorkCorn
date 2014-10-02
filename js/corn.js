//
//CORN_CLASS
function Corn(_x, _y, _z, _speed, _size){
	
	var that = this;

	this.x = _x;
	this.y = _y;
	this.z = _z;
	this.speed = _speed;

	this.sz = _size;

	this.cornMesh = 0;
	this.cMesh = [];

	this.cornRoutes = [
		"models/cornV2/cornStick2.js",
		"models/cornV2/c1.js", "models/cornV2/c2.js", "models/cornV2/c3.js", "models/cornV2/c4.js",
		"models/cornV2/c5.js", "models/cornV2/c6.js", "models/cornV2/c7.js", "models/cornV2/c8.js",
		"models/cornV2/c9.js", "models/cornV2/c10.js", "models/cornV2/c11.js", "models/cornV2/c12.js",
		"models/cornV2/c13.js", "models/cornV2/c14.js", "models/cornV2/c15.js", "models/cornV2/c16.js",
		"models/cornV2/c17.js", "models/cornV2/c18.js", "models/cornV2/c19.js", "models/cornV2/c20.js"
	];

	this.stickMat = new THREE.MeshLambertMaterial( {color: 0xfee9c9} );
	this.kernelMat = new THREE.MeshLambertMaterial( {color: 0xf7e120} );
	this.loaded = false;
	this.cLoaded = false;

	//
	var loader = new THREE.JSONLoader();

	loader.load(this.cornRoutes[0], function(geometry){

		//CENTER_PIVOT
		// geometry.center();

		that.cornMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color: 0xfee9c9} ));
		//console.log("cornMeshes");

		//SCALE_UP
		// that.cornMesh.scale.set(this.sz, this.sz, this.sz);
		that.cornMesh.scale.set(_size, _size, _size);

		that.cornMesh.position.set(_x, _y, _z); 

		scene.add(that.cornMesh);
		that.loaded = true;

	});

	/*
	for(var i=1; i<(this.cornRoutes.length); i++){
		loader.load(this.cornRoutes[i], function(geometry){

			//CENTER_PIVOT
			// geometry.center();

			// var c = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: this.tt, overdraw: true, side: THREE.DoubleSide}) );
			var c = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color: 0xf7e120} ));

			//SCALE_UP
			c.scale.set(10,10,10);
			c.rotation.y = 35*(Math.PI/180);

			that.cMesh.push(c);
			scene.add(c);

			
		});

		if( i==(this.cornRoutes.length-1) )
				that.cLoaded = true;
	}
	*/

	//

	

}

Corn.prototype.loadModel = function(){

	var loader = new THREE.JSONLoader();

	loader.load(this.cornRoutes[0], function(geometry){

		this.cornMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color: 0xfee9c9} ));
		scene.add(this.cornMesh);

	}, "js");

	for(var i=1; i<(this.cornRoutes.length-1); i++){
		loader.load(this.cornRoutes[i], function(geometry){

			this.c = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color: 0xf7e120} ));
			scene.add(this.c);

		}, "js");
	}

};

Corn.prototype.getCornMesh = function(){
	return this.cornMesh;
};

Corn.prototype.getCornKernelMeshes = function(){
	return this.cMesh;
};



/*
modelMaterial = new THREE.MeshLambertMaterial( {color: 0xf7e120} );
modelMaterialB = new THREE.MeshLambertMaterial( {color: 0xfee9c9} );
loadModelCorn("models/cornStick.js", "models/cornKernels.js", modelMaterial, modelMaterialB);
loadModelCornV2("models/cornV2/cornStick2.js", cornRoutes, modelMaterial, modelMaterialB);

var cornRoutes = [
	"models/cornV2/c1.js", "models/cornV2/c2.js", "models/cornV2/c3.js", "models/cornV2/c4.js",
	"models/cornV2/c5.js", "models/cornV2/c6.js", "models/cornV2/c7.js", "models/cornV2/c8.js",
	"models/cornV2/c9.js", "models/cornV2/c10.js", "models/cornV2/c11.js", "models/cornV2/c12.js",
	"models/cornV2/c13.js", "models/cornV2/c14.js", "models/cornV2/c15.js", "models/cornV2/c16.js",
	"models/cornV2/c17.js", "models/cornV2/c18.js", "models/cornV2/c19.js", "models/cornV2/c20.js"
];
*/