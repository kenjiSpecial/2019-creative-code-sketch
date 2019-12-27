import * as THREE from 'three';
window.THREE = THREE;
require('../vendors/OBJLoader');
const OrbitControls = require('three-orbit-controls')(THREE);
window.addEventListener('DOMContentLoaded', init);
import TweenMax, { Power4 } from 'gsap/TweenMax';
import dat from 'dat.gui';
import fragmentShaderSrc from './shader.frag';
import vertexShaderSrc from './shader.vert';

function init() {
	//ウィンドウの縦と横の長さを取得-----
	var width = window.innerWidth;
	var height = window.innerHeight;
	var debug = {
		shoot: shoot
	};
	var shootValue = {
		flush: 0,
		state: 0
	};

	function shoot() {
		renderer.setRenderTarget(pictureRenderTarget);
		phoneCamera.remove(mesh);
		renderer.render(scene, phoneCamera);

		TweenMax.killTweensOf(shootValue);
		TweenMax.killTweensOf(transition);

		shootValue.flush = 1;
		shootValue.state = 1;
		TweenMax.to(shootValue, 0.4, { flush: 0 });
		TweenMax.delayedCall(1, transition);
	}

	function transition() {
		TweenMax.to(shootValue, 0.8, { state: 0 });
	}
	//---------------------

	var gui = new dat.GUI();
	gui.add(debug, 'shoot').name('撮影する');

	// シーン---------------
	var scene = new THREE.Scene();
	//---------------------

	//Meshに追加する---------------------
	var geometry = new THREE.SphereGeometry(500, 30, 30);
	geometry.scale(-1, 1, 1);
	//---------------------

	//動画のテクスチャ---------------------
	var video = document.getElementById('video');
	video.play();

	var texture = new THREE.VideoTexture(video);
	texture.minFilter = THREE.LinearFilter;
	var material = new THREE.MeshBasicMaterial({ map: texture });

	//---------------------

	//メッシュ作る---------------------
	var sphere = new THREE.Mesh(geometry, material);
	scene.add(sphere);
	//---------------------

	// レンダラー---------------
	var renderer = new THREE.WebGLRenderer();
	// レンダラーが描画するキャンバスサイズの設定
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor({ color: 0x000000 });
	// キャンバスをDOMツリーに追加
	document.getElementById('stage').appendChild(renderer.domElement);
	//---------------------

	// カメラ---------------
	var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight);
	camera.position.set(0, 0, 0);
	camera.lookAt(new THREE.Vector3(1, 0, 0));
	scene.add(camera);

	//---------------------

	// ライト---------------
	//DirectionalLight(色,強度)をきめれる
	var light = new THREE.AmbientLight(0xcccccc);
	scene.add(light);
	var light = new THREE.PointLight(0xffffff, 1, 100);
	camera.add(light);
	//---------------------

	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('wheel', onDocumentMouseWheel, false);

	// レンダリング---------------------
	var isUserInteracting = false,
		lon = 0,
		lat = 0,
		phi = 0,
		theta = 0,
		distance = 50,
		onPointerDownPointerX = 0,
		onPointerDownPointerY = 0,
		onPointerDownLon = 0,
		onPointerDownLat = 0;

	function onDocumentMouseDown(event) {
		event.preventDefault();
		isUserInteracting = true;
		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;
		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}
	function onDocumentMouseMove(event) {
		if (isUserInteracting === true) {
			lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
			lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
		}
	}
	function onDocumentMouseUp() {
		isUserInteracting = false;
	}
	function onDocumentMouseWheel(event) {
		distance += event.deltaY * 0.05;
		distance = THREE.Math.clamp(distance, 1, 50);
	}

	function render() {
		phoneMat.uniforms.uState.value = shootValue.state;
		phoneMat.uniforms.uFlush.value = shootValue.flush;

		lat = Math.max(-85, Math.min(85, lat));
		phi = THREE.Math.degToRad(90 - lat);
		theta = THREE.Math.degToRad(lon);
		camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
		camera.position.y = distance * Math.cos(phi);
		camera.position.z = distance * Math.sin(phi) * Math.sin(theta);
		camera.lookAt(new THREE.Vector3());
		// マウスでカメラを操作するため
		renderer.setRenderTarget(renderTarget);
		camera.remove(mesh);
		renderer.render(scene, phoneCamera);
		// controls.update();
		//リピートするのに必要

		renderer.setRenderTarget(null);
		camera.add(mesh);
		renderer.render(scene, camera);

		requestAnimationFrame(render);
		//シーンとカメラをいれる。

		// control.update()
	}

	var loader = new THREE.OBJLoader();
	var mesh;
	var texture = new THREE.TextureLoader().load('uv.png');
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBAFormat;
	var debugMat = new THREE.MeshBasicMaterial({ map: texture });

	var d2Texture = new THREE.TextureLoader().load('MobilePhone_D2.jpg');
	d2Texture.minFilter = THREE.LinearFilter;
	d2Texture.magFilter = THREE.LinearFilter;
	d2Texture.format = THREE.RGBAFormat;
	var aoTexture = new THREE.TextureLoader().load('MobilePhone_AO.jpg');
	aoTexture.minFilter = THREE.LinearFilter;
	aoTexture.magFilter = THREE.LinearFilter;
	aoTexture.format = THREE.RGBAFormat;
	var bodyMaterial = new THREE.MeshPhongMaterial({ map: d2Texture, aoMap: aoTexture });

	var phoneCamera = new THREE.PerspectiveCamera(100, 1.89 / 3.32, 0.1, 1000);
	var renderTargetWid = 400;
	var renderTargetHig = (renderTargetWid * 3.32) / 1.89;
	var renderTarget = new THREE.WebGLRenderTarget(renderTargetWid, renderTargetHig);
	// var phoneMat = new THREE.MeshBasicMaterial({ map: renderTarget.texture });

	var pictureRenderTarget = new THREE.WebGLRenderTarget(renderTargetWid, renderTargetHig);
	var pictureMat = new THREE.MeshBasicMaterial({ map: pictureRenderTarget.texture });
	var phoneMat = new THREE.RawShaderMaterial({
		uniforms: {
			uState: { value: shootValue.state },
			uFlush: { value: shootValue.flush },
			uBaseTex: { value: renderTarget.texture },
			uPicTex: { value: pictureRenderTarget.texture }
		},
		vertexShader: vertexShaderSrc,
		fragmentShader: fragmentShaderSrc
	});

	loader.load('./mobile.obj', function(object) {
		mesh = object;
		// mesh.rotation.z = Math.PI / 2;
		mesh.position.z = -3;
		mesh.position.y = 0.5;
		// mesh.rotation.x = 0;
		camera.add(object);
		object.add(phoneCamera);
		phoneCamera.position.z = -10;
		phoneCamera.position.y = 10;

		for (let ii = 0; ii < mesh.children.length; ii++) {
			var kidMesh = mesh.children[ii];
			if (ii == 5) {
				kidMesh.material = phoneMat;
			} else if (ii == 4) {
				kidMesh.material = pictureMat;
			} else {
				kidMesh.material = bodyMaterial;
			}
		}

		if (mesh && material) {
			render();
		}

		// var fontTexture = new THREE.TextureLoader().load('number_font.png');
	});

	//---------------------
}
