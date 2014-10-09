
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


	var camera, scene, projector, raycaster, renderer;
	var realCamera;
	var guiVisible = true;
	var directLight, hemiLight;

	var effect, controls;

	var keyboard = new KeyboardState();
	var clock = new THREE.Clock();

	var perlin;

	var clouds = [], cloudMat;
	var ground;

	var storkGeo, storkWingRGeo, storkWingLGeo;
	var stork, storkWingR, storkWingL;
	var storkPlayers = [];

	var storkTexture, storkMaterial;
	var storkLoaded = false;
	var s = false, sR = false, sL = false;

	var storkWithLegs = [], storkWithLeg;

	var storkFlys = [], storkFly;

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
	var booms = [];

	var boomCount = -1;



	//WEB_CAM
	var video, videoImage, videoImageContext, videoTexture;
	var tvsets = [];
	var tvTexture;
	var screens = [];
	var screensR = [];
	var scr;
	var tvs = [];
	var tvsR = [];
	var tvWidth;

	var boomStart = [];

	var hugeCornX = 20, hugeCornZ = 0, hugeCornSize = 10;

	var scaleBack = false;



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
	var legWave, flyWaves = [];

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

	var colorRed = 204;



// window.addEventListener('load', initAudio, false);
window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();



//////////////////////////////////////////////////

init();
animate();

//////////////////////////////////////////////////

function init() {

	//Prevent scrolling for Mobile
	document.body.addEventListener('touchmove', function(event) {
	  event.preventDefault();
	}, false); 

	start = Date.now();
	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();

	perlin = new ImprovedNoise();

	//WEB_AUDIO_API
		bufferLoader = new BufferLoader(
			context,
			[
				'../audios/zissou_society_blue_star_cadets.mp3'
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
		legWave = new CosWave( timeWs[0], frequencyWing/3*2, amplitudeW/15, offsetW );
		flyWave = new CosWave( timeWs[0], frequencyWing/3*4, amplitudeW/15, offsetW );

		for(var i=0; i<12; i++){
			var flyW = new SinWave(timeWs[i%10], frequencyWing/2, amplitudeW/15, offsetW );
			flyWaves.push(flyW);
		}


	//GUI
		gui = new xgui({width: 100, height: window.innerHeight, backgroundColor: "#f55c74", frontColor: "#00ffff", dimColor: "#ffffff"});
		var guiDiv = document.getElementById('gui');
		guiDiv.appendChild(gui.getDomElement());

		soundBox = new gui.CheckBox( {x: 10, y: window.innerHeight-100, text: "music on/off", width: 16, height: 16} );
		soundBox.value.bind(chooseSound, "s");


	//SET_UP
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.name = 'oriCam';

	scene = new THREE.Scene();
	scene.name = 'mother of the land';
	scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
	//PointerLockControl
	pointerControls = new THREE.PointerLockControls(camera);
	scene.add( pointerControls.getObject() );



	//

	directLight = new THREE.DirectionalLight(0xffffff,1);
	directLight.position.set(0,1,2);
	directLight.castShadow = true;
	scene.add(directLight);

	var otherLight = new THREE.DirectionalLight(0xd6fcfe, 0.6);
	otherLight.position.set(0,1,-1);
	// scene.add(otherLight);

	otherLight = new THREE.DirectionalLight(0xd6fcfe, 1);
	otherLight.position.set(0,-1,-2);
	// scene.add(otherLight);

	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
	hemiLight.color.setHex(0xe8fdff);
	hemiLight.groundColor.setHex(0xffbcb5);
	hemiLight.position.set(0,300,0);
	scene.add(hemiLight);

	//
	renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
	renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize( width, height );
	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'deviceroientation', callback, false );

	//

	//MODELS
	var modelMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
	loadModelGround("models/cloud_ground.js", modelMaterial);

	cloudMat = new THREE.MeshLambertMaterial( {color: 0xffffff, emissive: 0x55ffff} );
	// cloudMat = new THREE.MeshLambertMaterial( {color: 0xffffff} );
	loadModelCloud("models/cloud_10.js", cloudMat);

	storkTexture = THREE.ImageUtils.loadTexture('images/stork.png');
	storkMaterial = new THREE.MeshLambertMaterial( {map: storkTexture} );
	var modelMaterialB = new THREE.MeshLambertMaterial( {color: 0xfcbac1, side: THREE.DoubleSide} );
	loadModelStork("models/storkA.js", "models/wingAR_center.js", "models/wingAL_center.js", "models/sack.js", storkMaterial, modelMaterialB);
	loadModelStorkL("models/stork_v2/storkBody.js", "models/wingAR_center.js", "models/wingAL_center.js", "models/stork_v2/legLU.js", "models/stork_v2/legRU.js", "models/stork_v2/legLB.js", "models/stork_v2/legRB.js", "models/sack.js", storkMaterial, modelMaterialB);
	

	var modelMaterialC = new THREE.MeshLambertMaterial( {color: 0xf7e120} );
	var modelMaterialD = new THREE.MeshLambertMaterial( {color: 0xfee9c9} );
	loadModelCorn("models/cornStick.js", "models/cornKernels.js", modelMaterialC, modelMaterialD);
	// loadModelCornV2("models/cornV2/cornStick2.js", cornRoutes, modelMaterial, modelMaterialB);

	loadModelStorkF("models/storkB.js", "models/wingAR_center.js", "models/wingAL_center.js", "models/sack.js", "models/cornStick.js", "models/cornKernels.js", storkMaterial, modelMaterialB, modelMaterialD, modelMaterialC);

	for(var i=0; i<63; i++){
		boomStart.push(false);
	}

	for(var i=0; i<63; i++){
		booms.push(false);
	}

	//WEB_CAM
	//-----------------------------------------------------------------
	//-----------------------------------------------------------------
	//-----------------------------------------------------------------
	//-----------------------------------------------------------------
		video = document.getElementById('monitor');
		videoImage = document.getElementById('videoImage');

		videoImageContext = videoImage.getContext('2d');
		videoImageContext.fillStyle = '0xffff00';
		videoImageContext.fillRect(0,0,videoImage.width, videoImage.height);

		videoTexture = new THREE.Texture( videoImage );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;
		
		videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
		videoTexture.needsUpdate = true;

		var tvGeo = new THREE.PlaneGeometry(1, 0.7, 1, 1);
		var tvMat = new THREE.MeshBasicMaterial({color: 0xfee9c9, map: videoTexture, overdraw: true, side: THREE.DoubleSide});
		tvMat.color.setRGB( 1,1,0 );

		//tvWidth = 20;
		//loadModelScreen("models/screen.js", tvMat);

		// var sph = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16), tvMat);
		// scene.add(sph);

		var kernelHeight = 7, kernelWidth = 9;
		for(var j=0; j<kernelHeight; j++) {
			for(var i=0; i<kernelWidth; i++){
			
				scr = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), tvMat);

				if(j==3) {
					scr.scale.set(1.5, 1.5, 1.5);
					scr.position.x = hugeCornX + Math.sin((360/kernelWidth*i)*(Math.PI/180))*5;
					scr.position.z = hugeCornZ + Math.sin((Math.PI/2 + (360/kernelWidth*i)*(Math.PI/180)))*5;
				}
				if(j==2 || j==4) {
					scr.scale.set(1.3, 1.3, 1.3);
					scr.position.x = hugeCornX + Math.sin((360/kernelWidth*i)*(Math.PI/180))*4.7;
					scr.position.z = hugeCornZ +Math.sin((Math.PI/2 + (360/kernelWidth*i)*(Math.PI/180)))*4.7;
				}
				if(j==1 || j==5){
					scr.scale.set(1.2, 1.2, 1.2);
					scr.position.x = hugeCornX + Math.sin((360/kernelWidth*i)*(Math.PI/180))*4.2;
					scr.position.z = hugeCornZ +Math.sin((Math.PI/2 + (360/kernelWidth*i)*(Math.PI/180)))*4.2;
				}
				if(j==0 || j==6){
					scr.position.x = hugeCornX + Math.sin((360/kernelWidth*i)*(Math.PI/180))*4;
					scr.position.z = hugeCornZ +Math.sin((Math.PI/2 + (360/kernelWidth*i)*(Math.PI/180)))*4;
				}
				scr.position.y = 3 + j*3.2;
				scr.rotation.y = (-Math.PI/2 + (360/kernelWidth*i)*(Math.PI/180));
				// scr.rotation.y = ((360/rabbitWidth*i)*(Math.PI/180));

				screens.push(scr);
				scene.add(scr);

			}
		}
		// var scr = new THREE.Mesh(tvGeo, tvMat);
		// scr.position.y = 5;
		// scene.add(scr);


		// for(var i=0; i<screens.length; i++){
		// 	screens[i].scale.set(0.01, 0.01, 0.01);
		// }


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
		cornSmall = new Corn(hugeCornX, 0, hugeCornZ, 1, hugeCornSize);

		// cornSmall = new Corn(0, 0, 0, 1, hugeCornSize);
		// cornSmall.loadModel();
		// cornSmalls.push( cornSmall.getCornMesh() );

}

var source1, gainNode1;

function finishedLoading(bufferList){
	
	//OLD
	source1 = context.createBufferSource();
	gainNode1 = context.createGain();

	source1.buffer = bufferList[0];
	source1.loop = true;
	source1.connect(gainNode1);
	gainNode1.connect(context.destination);
	gainNode1.gain.value = 0.0;

	source1.start(0);
	soundLoaded = true;
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
		ground.receiveShadow = true;

		scene.add(ground);
			
	}, "js");
}

function loadModelStork (model_A, model_B, model_C, model_D, meshMat, meshMatB) {

	var loader = new THREE.JSONLoader();
	loader.load(model_A, function(geometryA){

		storkGeo = geometryA.clone();
			
	}, "js");

}

function loadModelStorkL (model_A, model_B, model_C, model_D, model_E, model_F, model_G, model_H, meshMat, meshMatB) {

	// for(var i=0; i<12; i++){
		var colorStork = new THREE.Object3D();

		var loader = new THREE.JSONLoader();
		loader.load(model_A, function(geometryA){

			//storkGeo = geometryA.clone();
			storkBody = new THREE.Mesh(geometryA, meshMat);

			storkBody.name = "storkBody";

			colorStork.add(storkBody);
			// scene.add(storkBody);
			//s=true;
				
		}, "js");

		loader.load(model_B, function(geometryB){

			storkWingRGeo = geometryB.clone();
			storkWingR = new THREE.Mesh(geometryB, meshMat);
			storkWingR.position.y = 4.2;
			storkWingR.position.x = -0.8;
			storkWingR.position.z = 1;

			storkWingR.name = "storkWingR";

			colorStork.add(storkWingR);
			// scene.add(storkWingR);
			//sR=true;
				
		}, "js");

		loader.load(model_C, function(geometryC){

			storkWingLGeo = geometryC.clone();
			storkWingL = new THREE.Mesh(geometryC, meshMat);
			storkWingL.position.y = 4.2;
			storkWingL.position.x = 0.8;
			storkWingL.position.z = 1;

			storkWingL.name = "storkWingL";

			colorStork.add(storkWingL);
			// scene.add(storkWingL);
			//sL=true;
				
		}, "js");


		//LEGS
		loader.load(model_D, function(geometryD){

			//var LegLUGeo = geometryD.clone();
			var LegLU = new THREE.Mesh(geometryD, meshMat);
			LegLU.position.y = 3.3;
			LegLU.position.x = 0.5;

			LegLU.name = "LegLU";
			// LegLU.position.z = 1;

			colorStork.add(LegLU);
			// scene.add(LegLU);
				
		}, "js");

		loader.load(model_E, function(geometryE){

			//var LegRUGeo = geometryE.clone();
			var LegRU = new THREE.Mesh(geometryE, meshMat);
			LegRU.position.y = 3.3;
			LegRU.position.x = -0.5;
			// LegRU.position.z = 1;

			LegRU.name = "LegRU";

			colorStork.add(LegRU);
			// scene.add(LegRU);
				
		}, "js");

		loader.load(model_F, function(geometryF){

			//storkWingLGeo = geometryF.clone();
			var LegLB = new THREE.Mesh(geometryF, meshMat);
			LegLB.position.y = 2.02;
			LegLB.position.x = 0.57;
			// LegLB.position.z = 1;

			LegLB.name = "LegLB";

			colorStork.add(LegLB);
			// scene.add(LegLB);
				
		}, "js");

		loader.load(model_G, function(geometryG){

			//storkWingLGeo = geometryG.clone();
			var LegRB = new THREE.Mesh(geometryG, meshMat);
			LegRB.position.y = 2.02;
			LegRB.position.x = -0.57;
			// LegRB.position.z = 1;

			LegRB.name = "LegRB";

			colorStork.add(LegRB);
			// scene.add(LegRB);


			
				
		}, "js");

		loader.load(model_H, function(geometryH){

			var sack = new THREE.Mesh(geometryH, meshMatB);

			sack.name = "sack";

			colorStork.add(sack);
			storkWithLegs.push(colorStork);
			scene.add(colorStork);

			s=true;
			sR=true;
			sL=true;
				
		}, "js");
	// }

}

var storkFlyGeo, wingRGeo, wingLGeo, sackGeo;
var stickFlyGeo, kernelFlyGeo;

function loadModelStorkF(model_A, model_B, model_C, model_D, meshMat, meshMatB) {

	var loader = new THREE.JSONLoader();
	

	loader.load(model_A, function(geometryA){
		storkFlyGeo = geometryA.clone();	
		storkFlyGeo.verticesNeedUpdate = true; 
		storkFlyGeo.normalsNeedUpdate = true; 
		storkFlyGeo.computeFaceNormals(); 
		storkFlyGeo.computeVertexNormals(); 
		storkFlyGeo.computeBoundingSphere();

	}, "js");

	loader.load(model_B, function(geometryB){
		wingRGeo = geometryB.clone();
		wingRGeo.verticesNeedUpdate = true; 
		wingRGeo.normalsNeedUpdate = true; 
		wingRGeo.computeFaceNormals(); 
		wingRGeo.computeVertexNormals(); 
		wingRGeo.computeBoundingSphere();

	}, "js");

	loader.load(model_C, function(geometryC){
		wingLGeo = geometryC.clone();
		wingLGeo.verticesNeedUpdate = true; 
		wingLGeo.normalsNeedUpdate = true; 
		wingLGeo.computeFaceNormals(); 
		wingLGeo.computeVertexNormals(); 
		wingLGeo.computeBoundingSphere();	
	}, "js");

	loader.load(model_D, function(geometryD){
		sackGeo = geometryD.clone();
		sackGeo.verticesNeedUpdate = true; 
		sackGeo.normalsNeedUpdate = true; 
		sackGeo.computeFaceNormals(); 
		sackGeo.computeVertexNormals(); 
		sackGeo.computeBoundingSphere();

		for(var i=0; i<12; i++){
			var flyStork = new THREE.Object3D();

			var storkFly = new THREE.Mesh(storkFlyGeo, meshMat);
			storkFly.name = "storkFly";
			flyStork.add(storkFly);

			var wingR = new THREE.Mesh(wingRGeo, meshMat);
			wingR.position.y = 1.2;
			wingR.position.x = -0.8;
			wingR.position.z = 1;
			wingR.name = "wingR";
			flyStork.add(wingR);

			var wingL = new THREE.Mesh(wingLGeo, meshMat);
			wingL.position.y = 1.2;
			wingL.position.x = 0.8;
			wingL.position.z = 1;
			wingL.name = "wingL";
			flyStork.add(wingL);

			var sack = new THREE.Mesh(sackGeo, meshMatB);
			sack.name = "sack";
			sack.position.y -= 3;
			flyStork.add(sack);

			flyStork.fall = false;

			scene.add(flyStork);
			storkFlys.push(flyStork);		
		}

	}, "js");
}

function loadModelStorkF(model_A, model_B, model_C, model_D, model_E, model_F, meshMat, meshMatB, meshMatC, meshMatD) {

	var loader = new THREE.JSONLoader();
	

	loader.load(model_A, function(geometryA){
		storkFlyGeo = geometryA.clone();	
		storkFlyGeo.verticesNeedUpdate = true; 
		storkFlyGeo.normalsNeedUpdate = true; 
		storkFlyGeo.computeFaceNormals(); 
		storkFlyGeo.computeVertexNormals(); 
		storkFlyGeo.computeBoundingSphere();

	}, "js");

	loader.load(model_B, function(geometryB){
		wingRGeo = geometryB.clone();
		wingRGeo.verticesNeedUpdate = true; 
		wingRGeo.normalsNeedUpdate = true; 
		wingRGeo.computeFaceNormals(); 
		wingRGeo.computeVertexNormals(); 
		wingRGeo.computeBoundingSphere();

	}, "js");

	loader.load(model_C, function(geometryC){
		wingLGeo = geometryC.clone();
		wingLGeo.verticesNeedUpdate = true; 
		wingLGeo.normalsNeedUpdate = true; 
		wingLGeo.computeFaceNormals(); 
		wingLGeo.computeVertexNormals(); 
		wingLGeo.computeBoundingSphere();	
	}, "js");

	loader.load(model_D, function(geometryD){
		sackGeo = geometryD.clone();
		sackGeo.verticesNeedUpdate = true; 
		sackGeo.normalsNeedUpdate = true; 
		sackGeo.computeFaceNormals(); 
		sackGeo.computeVertexNormals(); 
		sackGeo.computeBoundingSphere();	
	}, "js");

	loader.load(model_E, function(geometryE){
		stickFlyGeo = geometryE.clone();
		stickFlyGeo.verticesNeedUpdate = true; 
		stickFlyGeo.normalsNeedUpdate = true; 
		stickFlyGeo.computeFaceNormals(); 
		stickFlyGeo.computeVertexNormals(); 
		stickFlyGeo.computeBoundingSphere();	
	}, "js");

	loader.load(model_F, function(geometryF){
		kernelFlyGeo = geometryF.clone();
		kernelFlyGeo.verticesNeedUpdate = true; 
		kernelFlyGeo.normalsNeedUpdate = true; 
		kernelFlyGeo.computeFaceNormals(); 
		kernelFlyGeo.computeVertexNormals(); 
		kernelFlyGeo.computeBoundingSphere();

		for(var i=0; i<12; i++){
			var flyStork = new THREE.Object3D();

			var storkFly = new THREE.Mesh(storkFlyGeo, meshMat);
			storkFly.name = "storkFly";
			flyStork.add(storkFly);

			var wingR = new THREE.Mesh(wingRGeo, meshMat);
			wingR.position.y = 1.2;
			wingR.position.x = -0.8;
			wingR.position.z = 1;
			wingR.name = "wingR";
			flyStork.add(wingR);

			var wingL = new THREE.Mesh(wingLGeo, meshMat);
			wingL.position.y = 1.2;
			wingL.position.x = 0.8;
			wingL.position.z = 1;
			wingL.name = "wingL";
			flyStork.add(wingL);

			var sack = new THREE.Mesh(sackGeo, meshMatB);
			sack.name = "sack";
			sack.position.y -= 3;
			flyStork.add(sack);
			flyStork.fall = false;

			var cStick = new THREE.Mesh(stickFlyGeo, meshMatC);
			cStick.name = "stick";
			cStick.scale.set(0.6,0.7,0.6);
			cStick.rotation.x = 90*Math.PI/180;
			cStick.position.set(0, 1.6, 2.9);
			flyStork.add(cStick);

			var cKernel = new THREE.Mesh(kernelFlyGeo, meshMatD);
			cKernel.name = "kernel";
			cKernel.scale.set(0.6,0.7,0.6);
			cKernel.rotation.x = 90*Math.PI/180;
			cKernel.position.set(0, 1.6, 2.9);
			flyStork.add(cKernel);


			scene.add(flyStork);
			storkFlys.push(flyStork);		
		}

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

		for(var i=0; i<24; i++){
			cornB = new THREE.Mesh(geometryB, meshMatB);
			cornB.scale.set(6,7,6);

			cornB.position.x = Math.sin((360/24*i)*(Math.PI/180))*40;
			cornB.position.y = -1;
			cornB.position.z = Math.sin(Math.PI/2 + (360/24*i)*(Math.PI/180))*40;

			cornKernels.push(cornB);
			scene.add(cornB);
		}
			
	}, "js");
}

function animate() {
	requestAnimationFrame(animate);

	update();
	render();
}

function render() {

	// WEB_CAM
		if(video.readyState === video.HAVE_ENOUGH_DATA){
			videoImageContext.drawImage(video, 0, 0,videoImage.width, videoImage.height);

			if(videoTexture){
				videoTexture.flipY = true;
				videoTexture.needsUpdate = true;
				// tvset.dynamic = true;
			}
		}

		renderer.clear();
	renderer.render( scene, camera );

}

var mirrorSide;
var step=0, radiusC=20;
var flyRotation, cloudRun;
var flyRun = [];

var boomTime = [];

function update() {

	// WEB_CAM
		video.play();

	var time = Date.now() * 0.00005;
	var delta = clock.getDelta();

	// THREE.AnimationHandler.update(delta);
	// controls.update( delta );

	stats.update();
	gui.update();

	pointerControls.update();

	//CLOUDS
		for(var i=0; i<clouds.length; i++){
			cloudRun = sinWaves[i].run();
			clouds[i].position.y = cloudRun;

			flyRun[i] = cloudRun;
		}

	//Storks
		if(s && sR && sL){
			wingRotation = wingWave.run();
			legRotation = legWave.run();
			flyRotation = flyWave.run(); 

			storkWithLegs[0].getObjectByName("storkWingR").rotation.x = wingRotation-0.1;
			storkWithLegs[0].getObjectByName("storkWingR").rotation.z = wingRotation-0.1;

			storkWithLegs[0].getObjectByName("storkWingL").rotation.x = wingRotation-0.1;
			storkWithLegs[0].getObjectByName("storkWingL").rotation.z = -wingRotation+0.1;

			storkWithLegs[0].getObjectByName("LegLU").rotation.x = legRotation;
			storkWithLegs[0].getObjectByName("LegRU").rotation.x = -legRotation;

			storkWithLegs[0].getObjectByName("LegLB").rotation.x = -legRotation/2;
			storkWithLegs[0].getObjectByName("LegRB").rotation.x = legRotation/2;

			storkWithLegs[0].getObjectByName("LegLB").position.z = -legRotation*1.2;
			storkWithLegs[0].getObjectByName("LegRB").position.z = legRotation*1.2;

		}

	//FLY_STORKS
		step += 0.3;
		for(var i=0; i<storkFlys.length; i++){
			//WAVES
			flyRun = flyWaves[i].run();

			//POSITION
			storkFlys[i].position.x = Math.sin((360/12*i + step)*(Math.PI/180))*radiusC;
			//storkFlys[i].position.y = 15 + flyRun*8;
			storkFlys[i].position.z = Math.sin(Math.PI/2 + (360/12*i + step)*(Math.PI/180))*radiusC;
			storkFlys[i].rotation.y = (360/12*i+90 + step)*(Math.PI/180);

			//WINGS
			storkFlys[i].getObjectByName("wingR").rotation.x = flyRotation-0.1;
			storkFlys[i].getObjectByName("wingL").rotation.x = flyRotation-0.1;

			//FALL
			if(storkFlys[i].fall){
				storkFlys[i].position.y -= 0.3;
				storkFlys[i].rotation.x = 180 *(Math.PI/180);
			}else{
				storkFlys[i].position.y = 15 + flyRun*8;
				// storkFlys[i].rotation.x = -90 *(Math.PI/180);
			}
		}



	

	//CORN_SMALL
		if(cornSmall.loaded == true){
			// console.log("yy");
			cornSmalls.push( cornSmall.getCornMesh() );
			cornSmall.loaded = false;
		}

		if(cornSmall.cLoaded == true){
			// console.log("zz");
			cornSmallKernels.push( cornSmall.getCornKernelMeshes() );
			cornSmall.cLoaded = false;
		}

		if(cornSmalls.length>0)
			// cornSmalls[0].position.y += 0.001;



		// BOOM_V1
		/*
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
		}*/

		// BOOM_V2
		if(cornSmalls.length>0 && screens.length>0) {

			// var dir = (screens[0].geometry.clone().center()).sub(cornSmalls[0].geometry.clone().center());
			// dir.normalize();
			// screens[0].position.sub(dir).multiplyScalar(1);

			/*
			for(var i=0; i<screens.length; i++){
				var dir = (screens[i].geometry.clone().center()).sub(cornSmalls[0].geometry.clone().center());
				dir.normalize();

				screens[i].position.sub(dir).multiplyScalar(2);

				if(boomStart[i]==false){
					boomTime.push(time);
					// console.log('record!');
					boomStart[i] = true;
				}

			}


			for(var i=0; i<screens.length; i++){
				if(time - boomTime[i] > 0.02){

					scene.remove(screens[i]);
					// console.log('remove kernels #' + i);

					screens.splice(i,1);
					boomStart.splice(i,1);
					boomTime.splice(i,1);
				}
			}*/

			// BOOM_V3
			/*
			if(boomCount > -1 && boomCount<screens.length){

				var rand = myArray[ Math.floor(Math.random() * (myArray.length-1)) ];

				var dir = (screens[boomCount].geometry.clone().center()).sub(cornSmalls[0].geometry.clone().center());
				dir.normalize();

				screens[boomCount].position.sub(dir).multiplyScalar(2);

				if(boomStart[boomCount]==false){
					boomTime.push(time);
					boomStart[boomCount] = true;
				}

				if(time - boomTime[boomCount] > 0.02){

					scene.remove(screens[boomCount]);
					// console.log('remove kernels #' + i);

					screens.splice(boomCount,1);
					boomStart.splice(boomCount,1);
					boomTime.splice(boomCount,1);
				}

			}*/

			// BOOM_V4
			for(var i=0; i<screens.length; i++){
				if(booms[i]){
					var dir = (screens[i].clone().position).sub(cornSmalls[0].clone().position.add(new THREE.Vector3( 20, 0, 4 )));
					dir.normalize();

					// console.log(screens[i].clone().position.sub(dir));
					// console.log(screens[i].clone().position.sub(dir));

					screens[i].position.sub(dir).multiplyScalar(2);

					if(boomStart[i]==false){
						boomTime.push(time);
						boomStart[i] = true;
					}

					if(time - boomTime[i] > 0.03){

						scene.remove(screens[i]);

						screens.splice(i,1);
						boomStart.splice(i,1);
						boomTime.splice(i,1);
						booms.splice(i,1);
					}
				}
			}
		}

		fireKernel = function(){
			var randNum = Math.floor(Math.random() * (screens.length-1));

			var dir = (screens[randNum].geometry.clone().center()).sub(cornSmalls[0].clone().position);
			dir.normalize();



			screens[randNum].position.sub(dir).multiplyScalar(2);

			if(boomStart[randNum]==false){
				boomTime.push(time);
				boomStart[randNum] = true;
			}

			if(time - boomTime[randNum] > 0.02){

				scene.remove(screens[randNum]);
				// console.log('remove kernels #' + i);

				screens.splice(randNum,1);
				boomStart.splice(randNum,1);
				boomTime.splice(randNum,1);
			}
		}


		// console.log(boomTime[0]);

		
	//KILLLLLLLL
	// find intersections
		window.onmousedown = function(event){

			// var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			// projector.unprojectVector( vector, camera );
			// raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

			var directionCam = pointerControls.getDirection().clone();
			raycaster.set( pointerControls.getObject().position.clone(), directionCam );



			var intersects = raycaster.intersectObjects( scene.children, true );
			//console.log(intersects);

			if ( intersects.length > 0 ) {

				console.log('hit');

				//console.log(intersects[ 0 ].object.parent);
				//scene.remove(intersects[ 0 ].object);

				if(intersects[ 0 ].object.parent != scene){


					if(!intersects[ 0 ].object.parent.fall) {
						intersects[ 0 ].object.parent.fall = true;
						renderer.setClearColor("rgb(204," + colorRed + "," + colorRed + ")", 1);
						directLight.color = new THREE.Color("rgb(225," + colorRed + "," + colorRed + ")");
						if(colorRed>20)
							colorRed -=20;
					}

					//console.log(intersects[ 0 ].object);

				} else {

					//console.log(intersects[ 0 ].object);
					// scene.remove(intersects[ 0 ].object);
				}

				
			}
		}	
		

	keyboard.update();
	if(keyboard.down("space")){

		// console.log(pointerControls.posX() + ", " + pointerControls.posY() + ", " + pointerControls.posZ());
		// console.log(storkWithLegs[0]);

		//RELEASE_cornK
		// boom = true;
		// boomCount++;
		// console.log(boomCount);
		// fireKernel();
		var randNum = Math.floor(Math.random() * (screens.length-1));
		booms[randNum] = true;



		// if(!scaleBack){
		// 	for(var i=0; i<screens.length; i++){

		// 		if(i==3) {
		// 			screens[i].scale.set(1.5, 1.5, 1.5);
		// 		}
		// 		if(i==2 || i==4) {
		// 			screens[i].scale.set(1.3, 1.3, 1.3);
		// 		}
		// 		if(i==1 || i==5){
		// 			screens[i].scale.set(1.2, 1.2, 1.2);
		// 		}
		// 		if(i==0 || i==6){
		// 			screens[i].scale.set(1.1, 1.1, 1.1);
		// 		}

		// 		screens[i].scale.set(2, 2, 2);
		// 	}

		// 	scaleBack = true;
		// }
		
	}

	//MUSIC_ON/OFF
		if(soundLoaded){
			if(chooseSound.s)
				gainNode1.gain.value = 0.8;
			else
				gainNode1.gain.value = 0;
		}

	//WEB_AUDIO_API
	/*
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
		*/

	//WEB_AUDIO_API_POSITION
		// if(soundLoaded){
		// 	sound.panner.setPosition( storkBody.position.x, storkBody.position.y, storkBody.position.z );
		// 	context.listener.setPosition( pointerControls.posX(), pointerControls.posY(), pointerControls.posZ() );
		// }

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

function createPlayer(locX, locY, locZ, rotY, colorMsg, qChange, id){

	var storkNewMat = new THREE.MeshLambertMaterial( {color: colorMsg} );
	var s = new THREE.Mesh(storkGeo, storkNewMat);
	s.position.set(locX, locY, locZ);
	// var pId = id;
	// var stringID = pId.toString();
	s.name = id;
	// console.log(id);
	// s.name = 5;

	if(qChange)
		s.rotation.y = -rotY;
	else
		s.rotation.y = rotY + 180*Math.PI/180;
	
	// if(!firstStork){
		scene.add(s);
		storkPlayers.push(s);
		console.log("new player!");
	// } else {
	// 	firstStork = false;
	// }
}


function updatePlayerStork(playerID, playerLocX, playerLocZ, playerRotY, qChange){

	// if(playerID<myID)
	// 	var index = playerID-1+storkPlayers.length;
	// else //playerID>myID
	// 	var index = playerID-2+storkPlayers.length-1;

	for(var i=0; i<storkPlayers.length; i++){
		if(storkPlayers[i].name == playerID){
			var index = i;

			console.log("update id: " + index + "!");

			break;
		}
	}

	storkPlayers[index].position.x = playerLocX;
	storkPlayers[index].position.z = playerLocZ;

	if(qChange)
		storkPlayers[index].rotation.y = -playerRotY;
	else
		storkPlayers[index].rotation.y = playerRotY + 180*Math.PI/180;
}


function removePlayer(playerID){
	// if(playerID<myID)
	// 	var index = storkPlayers.length;
	// else
	// 	var index = storkPlayers.length-1;

	for(var i=0; i<storkPlayers.length; i++){
		if(storkPlayers[i].name == playerID){
			var index = i;
			break;
		}
	}

	// storkPlayers[index].scale = 0.00001;
	scene.remove(storkPlayers[index]);
	// storkPlayers.splice(index,1);
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
	