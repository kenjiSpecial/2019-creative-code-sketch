import * as THREE from 'three';
window.THREE = THREE;
require('../vendors/OBJLoader');
const OrbitControls = require('three-orbit-controls')(THREE);
import { Firebase } from './firebase/firebase';

import dat from 'dat.gui';
import Stats from 'stats.js';

import { gsap } from 'gsap';

export default class App {
	constructor(params) {
		this.loop = this.loop.bind(this);
		this.params = params || {};
		this.players = [];

		this.makeRenderer();
		this.makeScene();
		this.makeCamera();
		this.makeUtils();
		this.resize();

		this.firebase = new Firebase();
		this.firebase.on('update', () => {
			this.updatePlayer();
		});
		this.firebase.on('register', () => {
			var form = document.getElementById('form');
			form.style.display = 'none';

			// this.animateIn();
		});
		this.renderer.render(this.scene, this.camera);

		this.animateIn();
		var self = this;
		window.addEventListener('beforeunload', function (e) {
			// e.preventDefault();
			// e.returnValue = '';
			self.firebase.removePlayer();
			
			// alert('test')
			
		});
	}

	makeRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		// renderer.setClearColorHex( 0xffffff, 1 );
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
		this.camera.position.y = 3;
		this.camera.position.z = 5;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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

	animateIn() {
		this.isLoop = true;
		gsap.ticker.add(this.loop);
	}

	loop() {
		this.renderer.render(this.scene, this.camera);
		if (this.stats) this.stats.update();
	}

	animateOut() {
		gsap.ticker.remove(this.loop);
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
			gsap.ticker.add(this.loop);
			this.playAndStopGui.name('pause');
		} else {
			gsap.ticker.remove(this.loop);
			this.playAndStopGui.name('play');
		}
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	destroy() {}

	addPlayer(name) {
		this.firebase.addPlayer(name);
	}

	updatePlayer() {
		let newDataSize = 0;
		for (const key in this.firebase.datas) {
			newDataSize = newDataSize + 1;
		}

		if (this.players.length < newDataSize) {
			const toAddPlayerSize = newDataSize - this.players.length;
			console.log(toAddPlayerSize);
			for (let ii = 0; ii < toAddPlayerSize; ii = ii + 1) {
				// var sphere = new THREE.SphereGeometry(1);
				// var mat =
				let geometry = new THREE.BoxGeometry(1, 1, 1);
				const color = new THREE.Color(Math.random(), Math.random(), Math.random());
				let mat = new THREE.MeshBasicMaterial({color: color});
				var mesh = new THREE.Mesh(geometry, mat);
				mesh.position.x = this.players.length * 3;

				this.players.push(mesh);
				this.scene.add(mesh);
			}



			gsap.to(this.camera.position, {x: (this.players.length - 1) * 3/2, y: this.players.length * 1 + 3, z: this.players.length * 1 + 5, duration: 1.2, ease: 'power2.inOut', onUpdate: ()=>{
				this.camera.lookAt(new THREE.Vector3(this.camera.position.x, 0, 0));
			}})
		} else if(this.players.length > newDataSize) {
			const removeToNumber = this.players.length - newDataSize;
			for(var ii = 0; ii < removeToNumber; ii = ii + 1){
				const mesh = this.players.pop();
				this.scene.remove(mesh);
			}

			gsap.to(this.camera.position, {x: (this.players.length - 1) * 3/2, y: this.players.length * 1 + 3, z: this.players.length * 1 + 5, duration: 1.2, ease: 'power2.inOut', onUpdate: ()=>{
				this.camera.lookAt(new THREE.Vector3(this.camera.position.x, 0, 0));
			}})
			console.log('removePlayer');
		}
	}
}
