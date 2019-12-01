import * as THREE from 'three';
window.THREE = THREE;
require('../vendors/OBJLoader');
const OrbitControls = require('three-orbit-controls')(THREE);
import fragmentShaderSrc from './shader.frag';
import vertexShaderSrc from './shader.vert';
import dat from 'dat.gui';
import Stats from 'stats.js';

import TweenMax, { Expo, Power4 } from 'gsap/TweenMax';

export default class App {
	constructor(params) {
		this.params = params || {};

		this.makeRenderer();
		this.makeScene();
		this.makeCamera();
		this.makeMesh();
		this.makeUtils();
		this.setupDebug();
		this.resize();
	}

	makeRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setClearColor(0xffffff);
		this.dom = this.renderer.domElement;
	}

	makeScene() {
		this.scene = new THREE.Scene();
	}

	makeCamera() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.01,
			100
		);
		this.camera.position.z = 2.5;
		// this.camera.position.y = -0.8;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.outputcamera = new THREE.OrthographicCamera(
			width / -2,
			width / 2,
			height / 2,
			height / -2,
			1,
			1000
		);

		this.outputcamera.position.z = 15;
		// this.outputcamera.position.y = 1;
		this.outputcamera.lookAt(new THREE.Vector3(0, 0, 0));

		this.outputScene = new THREE.Scene();
		var plane = new THREE.PlaneGeometry(1, 1);
		this.outputMat = new THREE.RawShaderMaterial({
			vertexShader: vertexShaderSrc,
			fragmentShader: fragmentShaderSrc,
			uniforms: {
				uTexture0: { value: null },
				uTexture1: { value: null },
				uTexture2: { value: null },
				uTexture3: { value: null },
				uMask: { value: null },
				uBase: { value: null }
			}
		});
		this.outputMesh = new THREE.Mesh(plane, this.outputMat);
		this.outputMesh.scale.set(window.innerWidth, window.innerHeight, 1);
		this.outputScene.add(this.outputMesh);
	}

	makeUtils() {
		this.clock = new THREE.Clock();
		this.control = new OrbitControls(this.camera);
	}

	setupDebug() {
		this.makeStats();
		this.makeGui();
		this.makeGrid();
	}

	makeStats() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
	}

	makeGui() {
		this.gui = new dat.GUI();
		this.playAndStopGui = this.gui.add(this, 'playAndStop').name('pause');
	}

	makeGrid() {
		var size = 1000;
		var divisions = 20;

		var gridHelper = new THREE.GridHelper(size, divisions);
		this.scene.add(gridHelper);
	}

	makeMesh() {
		const parent = './assets/';

		const arr = ['spring', 'summer', 'fall', 'winter'];
		const colors = [0x00ff00, 0x0000ff, 0xff0000, 0x333333];
		const total = arr.length;
		this.sceneArr = [];
		this.objectArr = [];
		this.meshArr = [];
		this.renderTargetArr = [];

		this.planeSceneArr = [];
		this.planeMseshArr = [];
		this.planeRenderTargetArr = [];

		this.baseScene = new THREE.Scene();
		this.baseObject = new THREE.Object3D();

		var light = new THREE.AmbientLight(0x101010); // soft white light
		this.baseObject.add(light);


		var light = new THREE.PointLight(0xffffff, 0.5, 100);
		light.position.set(0, 2, 0);
		this.baseObject.add(light);

		var light = new THREE.PointLight(0xffffff, 0.5, 100);
		light.position.set(0, -2, 0);
		this.baseObject.add(light);

		var box = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff
		});
		var boxMesh = new THREE.Mesh(box, material);
		// boxMesh.scale.set(1.05, 1.05, 1.05)
		this.baseObject.add(boxMesh);
		this.baseScene.add(this.baseObject);

		this.baseRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

		let cnt = 0;

		const self = this;

		var boxGeo = new THREE.BoxGeometry();

		const boxFaces = [];
		boxFaces[0] = boxGeo.faces[0];
		boxFaces[1] = boxGeo.faces[1];
		boxFaces[2] = boxGeo.faces[2];
		boxFaces[3] = boxGeo.faces[3];
		boxFaces[4] = boxGeo.faces[4];
		boxFaces[5] = boxGeo.faces[5];
		boxFaces[6] = boxGeo.faces[6];
		boxFaces[7] = boxGeo.faces[7];
		boxFaces[8] = boxGeo.faces[10];
		boxFaces[9] = boxGeo.faces[11];
		boxGeo.faces = boxFaces;

		this.planeObject = new THREE.Object3D();

		var plane = new THREE.PlaneGeometry(1, 1);

		const planeScene = new THREE.Scene();
		const planeMesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
		planeMesh.position.z = 0.5;

		const planeMesh2 = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
		planeMesh2.position.x = 0.5;
		planeMesh2.rotation.y = Math.PI / 2;

		const planeMesh3 = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
		planeMesh3.position.z = -0.5;
		planeMesh3.rotation.y = -Math.PI;

		const planeMesh4 = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0xffff00 }));
		planeMesh4.position.x = -0.5;
		planeMesh4.rotation.y = Math.PI * 1.5;

		this.planeObject.add(planeMesh);
		this.planeObject.add(planeMesh2);
		this.planeObject.add(planeMesh3);
		this.planeObject.add(planeMesh4);

		planeScene.add(this.planeObject);

		self.planeSceneArr.push(planeScene);

		// self.planeMseshArr.push(planeMesh);
		// self.planeMseshArr.push(planeMesh2);
		// self.planeMseshArr.push(planeMesh3);
		// self.planeMseshArr.push(planeMesh4);

		self.planeRenderTargetArr.push(
			new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
		);

		arr.forEach((element, index) => {
			const objUrl = `${parent}${element}.obj`;
			const color = colors[index];
			var loader = new THREE.OBJLoader();

			loader.load(
				objUrl,
				function(object) {
					var mesh = object.children[0];

					// var mat = new THREE.MeshPhongMaterial({ color: color });
					var material = new THREE.MeshPhongMaterial({
						color: color,
						side: THREE.BackSide
					});

					var parentObject = new THREE.Object3D();
					self.objectArr.push(parentObject);

					const _scene = new THREE.Scene();
					_scene.add(parentObject);

					const _mesh = new THREE.Mesh(mesh.geometry, material);
					parentObject.add(_mesh);

					const boxMesh = new THREE.Mesh(boxGeo, material);
					parentObject.add(boxMesh);

					var light = new THREE.AmbientLight(0x101010); // soft white light
					parentObject.add(light);

					var light = new THREE.PointLight(0xffffff, 0.5, 100);
					light.position.set(0, 0.0, 0.2);
					parentObject.add(light);
					self.meshArr.push(_mesh);
					self.sceneArr.push(_scene);

					parentObject.rotation.y = (Math.PI / 2) * cnt;

					self.renderTargetArr.push(
						new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
					);

					cnt = cnt + 1;

					if (cnt == arr.length) {
						self.animateIn();
					}
				},
				// called when loading is in progresses
				function(xhr) {
					console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
				},
				// called when loading has errors
				function(error) {
					console.log('An error happened');
				}
			);
		});
	}

	animateIn() {
		this.isLoop = true;

		this.outputMat.uniforms.uBase.value = this.baseRenderTarget.texture;

		this.outputMat.uniforms.uTexture0.value = this.renderTargetArr[0].texture;
		this.outputMat.uniforms.uTexture1.value = this.renderTargetArr[1].texture;
		this.outputMat.uniforms.uTexture2.value = this.renderTargetArr[2].texture;
		this.outputMat.uniforms.uTexture3.value = this.renderTargetArr[3].texture;

		this.outputMat.uniforms.uMask.value = this.planeRenderTargetArr[0].texture;
		TweenMax.ticker.addEventListener('tick', this.loop, this);
	}

	loop() {
		this.renderer.setRenderTarget(this.baseRenderTarget);
		this.renderer.render(this.baseScene, this.camera);

		

		this.baseObject.rotation.y = this.planeObject.rotation.y = this.planeObject.rotation.y - 0.005;

		for (let ii = 0; ii < this.renderTargetArr.length; ii = ii + 1) {
			this.objectArr[ii].rotation.y = this.objectArr[ii].rotation.y - 0.005;

			this.renderer.setRenderTarget(this.renderTargetArr[ii]);
			this.renderer.clear(true, true, true);
			this.renderer.render(this.sceneArr[ii], this.camera);
		}

		this.renderer.setRenderTarget(this.planeRenderTargetArr[0]);
		this.renderer.clear(true, true, true);
		this.renderer.render(this.planeSceneArr[0], this.camera);

		// ----------------------

		this.renderer.setRenderTarget(null);
		// this.renderer.render(this.planeSceneArr[0], this.camera);
		this.renderer.render(this.outputScene, this.outputcamera);

		if (this.stats) this.stats.update();
	}

	animateOut() {
		TweenMax.ticker.removeEventListener('tick', this.loop, this);
	}

	onMouseMove(mouse) {}

	onKeyDown(ev) {
		switch (ev.which) {
			case 27:
				this.playAndStop();
				break;
		}
	}

	playAndStop() {
		this.isLoop = !this.isLoop;
		if (this.isLoop) {
			TweenMax.ticker.addEventListener('tick', this.loop, this);
			this.playAndStopGui.name('pause');
		} else {
			TweenMax.ticker.removeEventListener('tick', this.loop, this);
			this.playAndStopGui.name('play');
		}
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	destroy() {}
}
