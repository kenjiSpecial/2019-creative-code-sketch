'use strict';
import * as THREE from 'three';
import fragmentShaderSrc from './shader.frag';
import vertexShaderSrc from './shader.vert';
import * as bodyPix from '@tensorflow-models/body-pix';

var net;
var cameras;
var canvas;
var video;
var videoWidth = 640;
var videoHeight = 360;
var maskTexture;
var renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setClearColor(0xffffff);
document.body.append(renderer.domElement);

var scene = new THREE.Scene();

var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var fontTexture = new THREE.TextureLoader().load('number_font.png');
fontTexture.minFilter = THREE.LinearFilter;
fontTexture.magFilter = THREE.LinearFilter;
fontTexture.format = THREE.RGBAFormat;

const plane = new THREE.PlaneGeometry(1, 1);
const shaderMaterial = new THREE.RawShaderMaterial({
	vertexShader: vertexShaderSrc,
	fragmentShader: fragmentShaderSrc,
	uniforms: {
		uTexture: { value: null },
		uMask: {value: null},
		uFontTexture: { value: fontTexture },
		uGridMinSize: { value: 6 },
		uGridMaxSize: { value: 30 },
		uProgress: { value: 1 },
		uProcess: { value: 1 },
		uWindowSize: { value: new THREE.Vector2(videoWidth, videoHeight) }
	}
});
var mesh = new THREE.Mesh(plane, shaderMaterial);
scene.add(mesh);

resize();

async function loadBodyPix() {
	net = await bodyPix.load();
}

async function getVideoInputs() {
	const devices = await navigator.mediaDevices.enumerateDevices();

	const videoDevices = devices.filter(device => device.kind === 'videoinput');

	return videoDevices;
}

async function setupCamera() {
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
	}

	const videoElement = document.getElementById('video');

	const stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { width: videoWidth, height: videoHeight }
	});
	videoElement.srcObject = stream;

	return new Promise(resolve => {
		videoElement.onloadedmetadata = () => {
			videoElement.width = videoElement.videoWidth;
			videoElement.height = videoElement.videoHeight;
			resolve(videoElement);
		};
	});
}

async function loadVideo() {
	video = await setupCamera();
	video.play();
	var texture = new THREE.VideoTexture(video);
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;
	shaderMaterial.uniforms.uTexture.value = texture;
	// document.body.appendChild(video)
}

async function main() {
	await loadBodyPix();
	await loadVideo();
	cameras = await getVideoInputs();

	canvas = document.createElement('canvas');
	canvas.width = 640;
	canvas.height = 360;
	document.body.appendChild(canvas);

	const ctx = canvas.getContext('2d');
	maskTexture = new THREE.Texture(canvas);
	maskTexture.minFilter = THREE.LinearFilter;
	maskTexture.magFilter = THREE.LinearFilter;
	maskTexture.format = THREE.RGBFormat;
	shaderMaterial.uniforms.uMask.value = maskTexture;

	var canvasWid = canvas.width;
	var canvasHig = canvas.height;
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, canvasWid, canvasHig);

	requestAnimationFrame(loop);
}

async function loop() {
	//  = await estimateSegmentation();

	const multiPersonSegmentation = await net.segmentPerson(video, {
		internalResolution: 'medium',
		segmentationThreshold: 0.7,
		maxDetections: 5,
		scoreThreshold: 0.6,
		nmsRadius: 20
	});

	const ctx = canvas.getContext('2d');
	var canvasWid = canvas.width;
	var canvasHig = canvas.height;
	
	var imgData = ctx.getImageData(0, 0, canvasWid, canvasHig);

	for (var yy = 0; yy < canvasHig; yy = yy + 1) {
		for (var xx = 0; xx < canvasWid; xx = xx + 1) {
			var index = xx + yy * canvasWid;
			var value = imgData.data[index * 4];
			var targetVal;
			if (multiPersonSegmentation.data[index] > 0) {
				targetVal = 255;
			}else{
				targetVal = 0;
			}
			if(Math.abs(targetVal - value) > 10){
				value = Math.floor(value + (targetVal - value) * 0.1);
			}else{
				if(targetVal - value > 0) value = value + 1;
				else if(targetVal - value < 0) value = value -1;
			}
			
			imgData.data[index * 4] = value
		}
	}

	ctx.putImageData(imgData, 0, 0);
	maskTexture.image = canvas;
	maskTexture.needsUpdate = true;
	shaderMaterial.uniforms.uMask.value = maskTexture;

	// console.log({ imgData, multiPersonSegmentation });

	// console.log(multiPersonSegmentation);
	// ctx.putImageData(multiPersonSegmentation, 0, 0);
	// const mask = bodyPix.toMask(
	// 	multiPersonSegmentation,
	// 	foregroundColor,
	// 	backgroundColor,
	// 	true
	//   );
	// bodyPix.drawMask(
	// 	canvas,
	// 	video,
	// 	mask,
	// 	0.5,
	// 	0.1,
	// 	true
	//   );

	// drawPoses(multiPersonSegmentation, flipHorizontally, ctx);

	renderer.render(scene, camera);

	requestAnimationFrame(loop);
}

function resize() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer.setSize(width, height);

	camera.left = -width / 2;
	camera.right = width / 2;
	camera.top = height / 2;
	camera.bottom = -height / 2;
	camera.updateProjectionMatrix();

	var glVideoWidth;
	var glVideoHeight;

	if ((videoHeight / videoWidth) * width > height) {
		glVideoWidth = width;
		glVideoHeight = (videoHeight / videoWidth) * glVideoWidth;
	} else {
		glVideoHeight = height;
		glVideoWidth = (videoWidth / videoHeight) * glVideoHeight;
	}

	mesh.scale.set(glVideoWidth, glVideoHeight, 1);
	shaderMaterial.uniforms.uWindowSize.value.set(videoWidth, videoHeight);
}

main();
