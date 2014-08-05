
//PointerLockControls
	var pointerControls, dateTime = Date.now();
	var objects = [];
	var rays = [];
	var blocker = document.getElementById('blocker');
	var instructions = document.getElementById('instructions');

	// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

	var havePointerLock = 
				'pointerLockElement' in document || 
				'mozPointerLockElement' in document || 
				'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		// console.log("havePointerLock");

		var element = document.body;

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				console.log("enable pointerControls");

				pointerControls.enabled = true;
				blocker.style.display = 'none';

			} else {

				pointerControls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

				instructions.style.display = '';
			}

		}

		var pointerlockerror = function(event){
			instructions.style.display = '';
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );


		if(isTouchDevice()) {
			console.log("isTouchDevice");
			

			instructions.addEventListener( 'touchend', funToCall, false );
		} else {
			instructions.addEventListener( 'click', funToCall, false );
		}


	} else {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

function isTouchDevice() { 
	return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
}

function funToCall(event){

	// console.log("click or touch!");

	instructions.style.display = 'none';

	// Ask the browser to lock the pointer
	element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

	pointerControls.enabled = true;

	if ( /Firefox/i.test( navigator.userAgent ) ) {

		var fullscreenchange = function ( event ) {

			if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

				document.removeEventListener( 'fullscreenchange', fullscreenchange );
				document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

				element.requestPointerLock();
			}

		}

		document.addEventListener( 'fullscreenchange', fullscreenchange, false );
		document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

		element.requestFullscreen();

	} else {

		element.requestPointerLock();

	}
}


//CHECK_COMPATIBILITY
	if(window.DeviceOrientationEvent){
		console.log("DeviceOrientation is supported");
	}

//THREE.JS
	//DETECTOR
		if(!Detector.webgl){
			Detector.addGetWebGLMessage();
			document.getElementById('container').innerHTML = "";
		}

	var container, stats;
	var width = window.innerWidth, height = window.innerHeight;


	var camera, scene, projector, renderer;
	var realCamera;
	var guiVisible = true;

	var effect, controls;

	var keyboard = new KeyboardState();
	var clock = new THREE.Clock();

	var perlin;

	var clouds = [];
	var ground;

	var storkGeo, storkWingRGeo, storkWingLGeo;
	var stork, storkWingR, storkWingL;
	var storkPlayers = [];

	var storkTexture, storkMaterial;
	var storkLoaded = false;
	var s = false, sR = false, sL = false;

	var cornSticks = [], cornKernels = [];

	var cornRoutes = [
			"models/cornV2/c1.js", "models/cornV2/c2.js", "models/cornV2/c3.js", "models/cornV2/c4.js",
			"models/cornV2/c5.js", "models/cornV2/c6.js", "models/cornV2/c7.js", "models/cornV2/c8.js",
			"models/cornV2/c9.js", "models/cornV2/c10.js", "models/cornV2/c11.js", "models/cornV2/c12.js",
			"models/cornV2/c13.js", "models/cornV2/c14.js", "models/cornV2/c15.js", "models/cornV2/c16.js",
			"models/cornV2/c17.js", "models/cornV2/c18.js", "models/cornV2/c19.js", "models/cornV2/c20.js"
	];

	var cornSmall, cornSmalls = [], cornSmallKernels = [];
	var boom = false;



//Wave
	var timeWs = [
		Math.PI/2, Math.PI, Math.PI/3, Math.PI/7, Math.PI/21.5,
		Math.PI+0.3, Math.PI/5, Math.PI/1.1, Math.PI/2.7, Math.PI+0.520
	];
	var frequencyW = 0.0005, frequencyWing = 0.08;
	var amplitudeW = 2;
	var offsetW = 0;
	var sinWaves = [];
	var spin;

	var runnings = [];

	var wingWave;

//GUI
	var gui;
	var soundBox, chooseSound = {s: 0.0};
	var soundBar, chooseVolume = {v: 0.0};


//WEB_AUDIO_API
	var context, bufferLoader;
	var source, buffer, audioBuffer, gainNode;
	var samples = 1024;
	var analyzer;

	var soundLoaded = false;
	var mainVolume;

	//BEAT_DETECT
	//source: http://www.airtightinteractive.com/
	var waveData = [], levelData = [], level, levelHistory = [];
	var bpmTime = 0, ratedBPMTime = 550, bpmStart;
	var BEAT_HOLD_TIME = 40;
	var BEAT_DECAY_RATE = 0.98;
	var BEAT_MIN = 0.215;

	//BPM
	var count = 0;
	var msecsFirst = 0, msecsPrevious = 0, msecsAvg = 633;
	var timer;
	var gotBeat = false;
	var beatCutOff = 0, beatTime;

	var frequencyByteData;	//0-256. no sound is 0
	var timeByteData;	//0-256. no sound is 128
	var levelCount = 16;

	var binCount, levelBins;

	var isPlayingAudio = false;


// window.addEventListener('load', initAudio, false);
window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();



//////////////////////////////////////////////////

init();
animate();

//////////////////////////////////////////////////

function init() {

	/*
	//EVENT_LISTENER
		if(window.DeviceOrientationEvent){
			document.getElementById("doEvent").innerHTML = "DeviceOrientation";

			window.addEventListener('deviceorientation', function(eventData){
				var tiltFB = eventData.beta;
				var tiltLR = eventData.gamma;
				var direction = eventData.alpha;

				deviceOrientationHandler(tiltFB, tiltLR, direction);
			}, false);
			
		} else {
			document.getElementById("doEvent").innerHTML = "Not supported on your device!";
		}
	*/

	//Prevent scrolling for Mobile
	document.body.addEventListener('touchmove', function(event) {
	  event.preventDefault();
	}, false); 

	start = Date.now();

	perlin = new ImprovedNoise();

	//WEB_AUDIO_API
		bufferLoader = new BufferLoader(
			context,
			[
				'../audios/mark_mothersbaugh_-_zissou_society_blue_star_cadets-irf.mp3'
			],
			finishedLoading
		);
		bufferLoader.load();


	//WAVE
		for(var i=0; i<20; i++){
			var sinW = new SinWave(timeWs[i%10], frequencyW*6.5, amplitudeW/2, offsetW);
			sinWaves.push(sinW);
		}

		wingWave = new SinWave( timeWs[0], frequencyWing, amplitudeW/15, offsetW );


	//GUI
		gui = new xgui({width: 100, height: window.innerHeight, backgroundColor: "#f55c74", frontColor: "#00ffff", dimColor: "#ffffff"});
		var guiDiv = document.getElementById('gui');
		guiDiv.appendChild(gui.getDomElement());

		soundBox = new gui.CheckBox( {x: 10, y: window.innerHeight-100, text: "music on/off", width: 16, height: 16} );
		soundBox.value.bind(chooseSound, "s");


	//SET_UP
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 20000 );

	/*
	//PATH_CAM
		controls = new THREE.PathControls(camera);
		controls.waypoints = [
			[-500,0,0], [0,200,0], [500,0,0]
		];
		controls.duration = 28;
		controls.useConstantSpeed = true;
		controls.lookSpeed = 0.06;
		controls.lookVertical = true;
		controls.lookHorizontal = true;
		controls.verticalAngleMap = { srcRange: [0,2*Math.PI], dstRange: [1.1, 3.8] };
		controls.horizontalAngleMap = { srcRange: [0,2*Math.PI], dstRange: [0.3, Math.PI - 0.3] };
		controls.lon = 180;
		controls.init();
	*/


	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
	//PointerLockControl
	pointerControls = new THREE.PointerLockControls(camera);
	scene.add( pointerControls.getObject() );

	//PATH_CAM
	// scene.add(controls.animationParent);
	// scene.add(camera);

	//

	var light = new THREE.DirectionalLight(0xffffff,1);
	light.position.set(0,1,2);
	scene.add(light);

	light = new THREE.DirectionalLight(0xd6fcfe, 0.6);
	light.position.set(0,1,-1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xd6fcfe, 1);
	light.position.set(0,-1,-2);
	scene.add(light);

	//
	renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
	renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize( width, height );
	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'deviceroientation', callback, false );


	//MODELS
	// var groundGeo = THREE.PlaneGeometry(1000,1000,5,5);
	// var groundMat = new THREE.MeshLambertMaterial( {color: 0x1a2b2b} );
	// ground = new THREE.Mesh(groundGeo, groundMat);
	// ground.rotation.x = -Math.PI/2;
	// ground.position.y -= 10;
	// scene.add(ground);

	var modelMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
	loadModelGround("models/cloud_ground.js", modelMaterial);

	// rabbitTexture = THREE.ImageUtils.loadTexture('images/rabbit.png');
	modelMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	loadModelCloud("models/cloud_10.js", modelMaterial);

	storkTexture = THREE.ImageUtils.loadTexture('images/stork.png');
	storkMaterial = new THREE.MeshLambertMaterial( {map: storkTexture} );
	var modelMaterialB = new THREE.MeshLambertMaterial( {color: 0xfcbac1, side: THREE.DoubleSide} );
	loadModelStork("models/storkA.js", "models/wingAR_center.js", "models/wingAL_center.js", "models/sack.js", storkMaterial, modelMaterialB);

	modelMaterial = new THREE.MeshLambertMaterial( {color: 0xf7e120} );
	modelMaterialB = new THREE.MeshLambertMaterial( {color: 0xfee9c9} );
	loadModelCorn("models/cornStick.js", "models/cornKernels.js", modelMaterial, modelMaterialB);
	// loadModelCornV2("models/cornV2/cornStick2.js", cornRoutes, modelMaterial, modelMaterialB);


	//

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);

	// controls.animation.play();

	//CORN
		cornSmall = new Corn(0,0,0, 1, cornSmalls);
		// cornSmall.loadModel();
		// cornSmalls.push( cornSmall.getCornMesh() );

}

function finishedLoading(bufferList){
	analyzer = context.createAnalyser();
	analyzer.smoothingTimeConstant = 0.8;	//
	analyzer.fftSize = samples;
	binCount = analyzer.frequencyBinCount;
	levelBins = Math.floor(binCount/levelCount);

	frequencyByteData = new Uint8Array(binCount);
	timeByteData = new Uint8Array(binCount);

	var length = 256;
	for(var i=0; i<length; i++){
		levelHistory.push(0);
	}

	mainVolume = context.createGain();
	mainVolume.connect(context.destination);

	// Create an object with a sound source and a volume control.
	sound = {};
	sound.source = context.createBufferSource();
	sound.volume = context.createGain();

	sound.source.buffer = bufferList[0];
	sound.source.loop = true;


	sound.source.connect(analyzer);
	analyzer.connect(sound.volume);
	// sound.volume.connect(mainVolume);

	//ADD_POSITION_VARIABLE
	sound.panner = context.createPanner();
	sound.volume.connect(sound.panner);
	sound.panner.connect(mainVolume);



	sound.volume.gain.value = 1;

	sound.source.start(0);

	soundLoaded = true;

	//ORIENTATION_not working yet
		/*
		vec = new THREE.Vector3(0,0,1);
		m = stork.matrixWorld;
		mx = m.elements[3], my = m.elements[7], mz = m.elements[11];
		m.elements[3] = m.elements[7] = m.elements[11] = 0;

		vec.multiply(m);
		vec.normalize();

		sound.panner.setOrientation(vec.x, vec.y, vec.z);

		// m.n14 = mx;
		// m.n24 = my;
		// m.n34 = mz;
		*/
}

function onBeat(){
	gotBeat = true;
}

function noteFromPitch(frequency){
  var noteNum = 12*(Math.log(frequency/440)/Math.log(2));
  return Math.round(noteNum)+69;
}

function freqencyFromNote(note){
  return 440* Math.pow(2, (note+69)/12);
}

function centsOffFromPitch(frequency){
  return ( 1200 * Math.log(frequency/freqencyFromNote(note) ) / Math.log(2) );
}

function updatePitch(time){
	var cycles = [];
	analyser.getByteTimeDomainData(buf);
}


var frame = 0;
var rabbitScale = 30;

function loadModelR (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){

		for(var i=0; i<5; i++){
			rabbit = new THREE.Mesh(geometry, meshMat);
			rabbit.scale.set(rabbitScale,rabbitScale,rabbitScale);
			rabbit.position.x = 20+60*(i+1);
			// rabbit.rotation.x = Math.PI/2;
			rabbit.rotation.y = -Math.PI/2;

			rabbits.push(rabbit);
			scene.add(rabbit);
		}
		for(var i=0; i<5; i++){
			rabbit = new THREE.Mesh(geometry, meshMat);
			rabbit.scale.set(rabbitScale,rabbitScale,rabbitScale);
			rabbit.position.x = -20-60*(i+1);
			// rabbit.rotation.x = Math.PI/2;
			rabbit.rotation.y = -Math.PI/2;

			rabbits.push(rabbit);
			scene.add(rabbit);
		}
			
	}, "js");
}

function loadModelCloud (model_A, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model_A, function(geometry){

		for(var i=0; i<20; i++){
			var cloud = new THREE.Mesh(geometry, meshMat);
			// cloud.position.set(-40+Math.random()*80, -10+Math.random()*20, -40+Math.random()*80);

			cloud.position.x = Math.sin((360/20*(i+1))*(Math.PI/180))*30;
			cloud.position.z = Math.sin((Math.PI/2 + (360/20*(i+1))*(Math.PI/180)))*30;
			cloud.position.y = -5+Math.random()*10;

			cloud.rotation.y = ((360/20*(i+1))*(Math.PI/180));

			var cloudSize = 1+Math.random()*3;
			cloud.scale.set(cloudSize, cloudSize, cloudSize);

			clouds.push(cloud);
			scene.add(cloud);
		}
			
	}, "js");
}

function loadModelGround (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){

		ground = new THREE.Mesh(geometry, meshMat);
		ground.scale.set(3,3,3);
		scene.add(ground);
			
	}, "js");
}

function loadModelStork (model_A, model_B, model_C, model_D, meshMat, meshMatB) {

	var loader = new THREE.JSONLoader();
	loader.load(model_A, function(geometryA){

		storkGeo = geometryA.clone();
		stork = new THREE.Mesh(geometryA, meshMat);
		scene.add(stork);
		s=true;
			
	}, "js");

	loader.load(model_B, function(geometryB){

		storkWingRGeo = geometryB.clone();
		storkWingR = new THREE.Mesh(geometryB, meshMat);
		storkWingR.position.y = 4.2;
		storkWingR.position.x = -0.8;
		storkWingR.position.z = 1;

		scene.add(storkWingR);
		sR=true;
			
	}, "js");

	loader.load(model_C, function(geometryC){

		storkWingLGeo = geometryC.clone();
		storkWingL = new THREE.Mesh(geometryC, meshMat);
		storkWingL.position.y = 4.2;
		storkWingL.position.x = 0.8;
		storkWingL.position.z = 1;

		scene.add(storkWingL);
		sL=true;
			
	}, "js");

	loader.load(model_D, function(geometryD){

		var sack = new THREE.Mesh(geometryD, meshMatB);
		scene.add(sack);
			
	}, "js");

}

function loadModelCorn (model_A, model_B, meshMatB, meshMatA) {

	var loader = new THREE.JSONLoader();
	loader.load(model_A, function(geometryA){

		var cornA = new THREE.Mesh(geometryA, meshMatA);
		cornA.scale.set(0.7,0.8,0.7);
		cornA.rotation.x = 90*Math.PI/180;
		cornA.position.set(0, 4.75, 2.7);

		cornSticks.push(cornA);
		scene.add(cornA);
			
	}, "js");

	loader.load(model_B, function(geometryB){

		var cornB = new THREE.Mesh(geometryB, meshMatB);
		cornB.scale.set(0.7,0.8,0.7);
		cornB.rotation.x = 90*Math.PI/180;
		cornB.position.set(0, 4.75, 2.7);

		cornKernels.push(cornB);
		scene.add(cornB);
			
	}, "js");
}

function animate() {
	requestAnimationFrame(animate);

	update();
	render();
}

function render() {
	renderer.render( scene, camera );

}

var mirrorSide;

function update() {

	var time = Date.now() * 0.00005;
	var delta = clock.getDelta();

	// THREE.AnimationHandler.update(delta);
	// controls.update( delta );

	stats.update();
	gui.update();

	pointerControls.update();

	//Storks
		if(s && sR && sL){
			var wingRotation = wingWave.run()
			storkWingR.rotation.x = wingRotation-0.1;
			storkWingL.rotation.x = wingRotation-0.1;
		}



	//CLOUDS
		for(var i=0; i<clouds.length; i++){
			var run = sinWaves[i].run();
			clouds[i].position.y = run;
		}

	//CORN_SMALL
		if(cornSmall.loaded == true){
			console.log("yy");
			cornSmalls.push( cornSmall.getCornMesh() );
			cornSmall.loaded = false;
		}

		if(cornSmall.cLoaded == true){
			console.log("zz");
			cornSmallKernels.push( cornSmall.getCornKernelMeshes() );
			cornSmall.cLoaded = false;
		}

		if(cornSmalls.length>0)
			// cornSmalls[0].position.y += 0.001;



		
		if(cornSmallKernels.length>0 && cornSmalls.length>0 && boom==true) {

			var dir = (cornSmallKernels[0][0].geometry.clone().center()).sub(cornSmalls[0].geometry.clone().center());
			// var dir = cornSmalls[0].position.sub(cornSmallKernels[0][0].position);
			dir.normalize();

			cornSmallKernels[0][0].position.sub(dir).multiplyScalar(1);

			for(var i=0; i<cornSmallKernels[0].length; i++){
				var dir = (cornSmallKernels[0][i].geometry.clone().center()).sub(cornSmalls[0].geometry.clone().center());
				dir.normalize();

				cornSmallKernels[0][i].position.sub(dir).multiplyScalar(1.5);
			}
		}
		


	keyboard.update();
	if(keyboard.down("space")){

		console.log(pointerControls.posX() + ", " + pointerControls.posY() + ", " + pointerControls.posZ());

		//RELEASE_cornK
		boom = true;
	}

	//MUSIC_ON/OFF
		if(soundLoaded){
			if(chooseSound.s)
				sound.volume.gain.value = 1;
			else
				sound.volume.gain.value = 0.0;
		}

	//WEB_AUDIO_API
		if(analyzer){
			analyzer.getByteFrequencyData( frequencyByteData );
			analyzer.getByteTimeDomainData( timeByteData );

			//normalize freq data
			for(var i=0; i<binCount; i++){
				waveData[i] = ((timeByteData[i]-128)/128) * 1;
			}

			//normalize levels data from freq
			for(var i=0; i<levelCount; i++){
				var sum=0;
				for(var j=0; j<levelBins; j++){
					sum += frequencyByteData[(i*levelBins) + j];
				}
				levelData[i] = sum/levelBins/256 * 1;
			}

			//get avg level
			var sum = 0;
			for(var i=0; i<levelCount; i++){
				sum += levelData[i];
			}

			level = sum / levelCount;
			levelHistory.push(level);
			levelHistory.shift(1);

			//BEAT detection
			if(level > beatCutOff && level > BEAT_MIN){
				// console.log("on beat!");
				// onBeat();
				gotBeat = true;

				beatCutOff = level * 1.5;
				beatTime = 0;
			} else {
				gotBeat = false;

				if(beatTime <= 50){	//
					beatTime ++;
				}else{
					beatCutOff *= 0.9;	//
					beatCutOff = Math.max(beatCutOff, BEAT_MIN);
				}
			}

			bpmTime = (new Date().getTime()-bpmStart)/msecsAvg;
		}

	//WEB_AUDIO_API_POSITION
		if(soundLoaded){
			sound.panner.setPosition( stork.position.x, stork.position.y, stork.position.z );
			context.listener.setPosition( pointerControls.posX(), pointerControls.posY(), pointerControls.posZ() );
		}

		//ORIENTATION
		//http://www.html5rocks.com/en/tutorials/webaudio/positional_audio/
		/*
		var camM = pointerControls.getMatrix();
		var camMx = camM.elements[3], camMy = camM.elements[7], camMz = camM.elements[11];
		camM.elements[3] = camM.elements[7] = camM.elements[11] = 0;

		var camVec = new THREE.Vector3(0,0,1);
		camVec.multiply(camM);
		camVec.normalize();

		var camUp = new THREE.Vector3(0,-1,0);
		camUp.multiply(camM);
		camUp.normalize();

		context.listener.setOrientation(camVec.x, camVec.y, camVec.z, camUp.x, camUp.y, camUp.z);

		camM.elements[3] = camMx;
		camM.elements[7] = camMy;
		camM.elements[11] = camMz;
		*/

}

var firstStork = true;


function createStork(locX, locY, locZ, rotY, colorMsg){

	var storkNewMat = new THREE.MeshLambertMaterial( {color: colorMsg} );
	var s = new THREE.Mesh(storkGeo, storkNewMat);
	s.position.set(locX, locY, locZ);
	s.rotation.y = rotY;
	scene.add(s);
	console.log("new stork!");
}

function createPlayer(locX, locY, locZ, rotY, colorMsg, qChange){

	var storkNewMat = new THREE.MeshLambertMaterial( {color: colorMsg} );
	var s = new THREE.Mesh(storkGeo, storkNewMat);
	s.position.set(locX, locY, locZ);

	if(qChange)
		s.rotation.y = -rotY;
	else
		s.rotation.y = rotY + 180*Math.PI/180;
	
	if(!firstStork){
		scene.add(s);
		storkPlayers.push(s);
		console.log("new player!");
	} else {
		firstStork = false;
	}
}


function updatePlayerStork(playerID, playerLocX, playerLocZ, playerRotY, qChange){

	if(playerID<myID)
		var index = playerID-1;
	else
		var index = playerID-2;

	storkPlayers[index].position.x = playerLocX;
	storkPlayers[index].position.z = playerLocZ;

	if(qChange)
		storkPlayers[index].rotation.y = -playerRotY;
	else
		storkPlayers[index].rotation.y = playerRotY + 180*Math.PI/180;
}


function removePlayer(playerID){
	if(playerID<myID)
		var index = playerID-1;
	else
		var index = playerID-2;
	
	scene.remove(storkPlayers[index]);
}


var sphereBack = true;
var bokehReset = false;


function paramsReset() {

	chooseFocus.f = 1.0;
	chooseAperture.a = 0.025;
	chooseBlur.b = 1.0;
	chooseAspect.a = 1.0;

	bokehEffect.uniforms["focus"].value = chooseFocus.f;
	bokehEffect.uniforms["aperture"].value = chooseAperture.a;
	bokehEffect.uniforms["maxblur"].value = chooseBlur.b;
	bokehEffect.uniforms["aspect"].value = chooseAspect.a;
}

function randomizeParams(){
	chooseFocus.f = Math.random()*3.0+0.01;
	chooseAperture.a = Math.random()+0.001;
	chooseBlur.b = Math.random()*3.0+0.01;
	chooseAspect.a = Math.random()*3.0+0.01;
}

function onWindowResize(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		// realCamera.aspect = window.innerWidth / window.innerHeight;
		// realCamera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		// effect.setSize(window.innerWidth, window.innerHeight);
		// controls.handleResize();
}	

function callback(event){
	console.log("orientation gamma: ", event.gamma, "beta ", event.beta, "alpha ", event.alpha);
}

function deviceOrientationHandler(tiltFB, tiltLR, direction){
	document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
	document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
	document.getElementById("doDirection").innerHTML = Math.round(direction);
}
	