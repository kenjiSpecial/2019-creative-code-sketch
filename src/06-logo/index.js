import * as THREE from 'three';
window.THREE = THREE;
require('../vendors/OBJLoader');
const OrbitControls = require('three-orbit-controls')(THREE);

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
		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			100
		);
		this.camera.position.z = 12;
	}

	makeUtils() {
		this.clock = new THREE.Clock();
		// this.control = new OrbitControls(this.camera);
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
		const parent = './assets/obj/20191026ah/ah_';


		const arr = ['0.15', '0.3', '0.45', '0.6', '0.75', '0.9', '1.05', '1.2', '1.35', '1.5'];
		const total = arr.length;
		this.meshes0 = [];
		this.meshes1 = [];
		this.meshes2 = [];
		let cnt = 0;

		const self = this;
		var mat = new THREE.MeshBasicMaterial({color: 0x000000})
		
		arr.forEach((element, index) => {
			const objUrl = `${parent}${element}.obj`;
			var loader = new THREE.OBJLoader();

			// load a resource

			loader.load(
				// resource URL
				objUrl,
				// called when resource is loaded
				function(object) {
					// console.log(object);
					var mesh = object.children[0];
					// mesh.material = mat;
					
					const mesh0 = new THREE.Mesh(mesh.geometry, mat);
					self.meshes0[index] = mesh0;

					const mesh1 = new THREE.Mesh(mesh.geometry, mat);
					self.meshes1[index] = mesh1;
					mesh1.position.x = 4;

					const mesh2 = new THREE.Mesh(mesh.geometry, mat);
					self.meshes2[index] = mesh2;
					mesh2.position.x = -4;

					self.scene.add(mesh0);
					self.scene.add(mesh1);
					self.scene.add(mesh2);
					cnt = cnt + 1;
					
					if(cnt == arr.length){
						self.animateIn()
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
		TweenMax.ticker.addEventListener('tick', this.loop, this);
		
		// for(let ii = 0; ii < this.meshes.length; ii = ii + 1){
		// 	this.meshes[ii].rotation.z = this.meshes[ii].rotation.z + (0.02 + 0.02 * ii);
		// 	this.meshes[ii].rotation.x = this.meshes[ii].rotation.x + (0.02 + 0.02 * ii);
		// 	this.meshes[ii].rotation.y = this.meshes[ii].rotation.y + (0.02 + 0.02 * ii);
		// }
		var tl = new TimelineMax({repeat:-1});
		let cnt = this.meshes0.length;
		for(let ii = 0; ii < this.meshes0.length; ii = ii + 1){
			let rot = 3.1415 * 4;
			tl.to(this.meshes0[ii].rotation, 3, {y: '+' + rot, ease: Power4.easeInOut}, 0.06 * (ii + cnt/2) )
		}

		for(let ii = 0; ii < this.meshes0.length; ii = ii + 1){
			let rot = 3.1415 * 4;
			tl.to(this.meshes1[ii].rotation, 3, {x: '+' + rot, ease: Power4.easeInOut}, 0.06 *( ii + cnt))
		}
	
		for(let ii = 0; ii < this.meshes0.length; ii = ii + 1){
			let rot = 3.1415 * 4;
			tl.to(this.meshes2[ii].rotation, 3, {z: '+' + rot, ease: Power4.easeInOut}, 0.06 * ii )
		}	
	}

	loop() {
		
		this.renderer.render(this.scene, this.camera);
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
