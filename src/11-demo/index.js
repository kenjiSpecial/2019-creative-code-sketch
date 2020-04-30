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
		var inputText = document.getElementById('inputText');
		var isRegister = false;
		var btn = document.getElementById('btn');
		var inputText = document.getElementById('inputText');

		this.firebase = new Firebase();
		this.firebase.on('update', () => {
			this.updatePlayer();
		});
		this.firebase.on('register', () => {
			var formName = document.getElementById('form-name');
			formName.style.display = 'none';

			var formMessage = document.getElementById('form-message');
			formMessage.style.display = 'block';

			// var btn = document.getElementById('btn')
			// btn.style.display = 'none';

			inputText.value = '';
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
		inputText.addEventListener('change', function () {
			// self.updateMessage(inputText.value);
		});
		this.makeGrid();

		btn.addEventListener('click', function () {
			if (isRegister) {
				self.updateMessage(inputText.value);
				return;
			}

			isRegister = true;

			if (self.firebase.getID()) {
				self.updateMessage(inputText.value);
			} else {
				self.addPlayer(inputText.value);
			}
		});
		var form = document.getElementById('form');
		form.addEventListener('submit', function (event) {
			event.preventDefault();
		});
	}

	updateMessage(value) {
		console.log(value);

		this.firebase.updateMessage(value);
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
		var size = 40;
		var divisions = 20;

		var gridHelper = new THREE.GridHelper(size, divisions);
		this.scene.add(gridHelper);
		gridHelper.position.y = -0.5;
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
		const curDataCollection = [];
		for (const key in this.firebase.datas) {
			const data = { key: key, name: this.firebase.datas[key].name };
			curDataCollection.push(data);
		}

		if (this.players.length < curDataCollection.length) {
			for (let ii = 0; ii < curDataCollection.length; ii = ii + 1) {
				const curData = curDataCollection[ii];
				let isNewData = true;

				for (let j = 0; j < this.players.length; j = j + 1) {
					if (this.players[j].key == curData.key) {
						isNewData = false;
					}
				}

				if (isNewData) {
					let geometry = new THREE.BoxGeometry(1, 1, 1);
					const color = new THREE.Color(Math.random(), Math.random(), Math.random());

					var textureCanvas = document.createElement('canvas');
					textureCanvas.width = 256;
					textureCanvas.height = 256;
					var ctx = textureCanvas.getContext('2d');
					ctx.font = 'normal bold 60px sans-serif';
					ctx.textAlign = 'center';

					ctx.fillStyle = '#ffffff';
					ctx.fillText(curData.name, 256 / 2, 256 / 2 + 20);

					const tex = new THREE.Texture(textureCanvas);
					tex.needsUpdate = true;
					let mat = new THREE.MeshBasicMaterial({
						map: tex,
					});
					var mesh = new THREE.Mesh(geometry, mat);
					mesh.position.x = this.players.length * 3;
					
					gsap.from(mesh.scale, {
						duration: 0.8,
						x: 0.01,
						y: 0.01,
						z: 0.01,
						ease: 'power2.inOut',
					});

					this.scene.add(mesh);

					const textCanvas = document.createElement('canvas');
					textureCanvas.width = 256;
					textureCanvas.height = 256;

					this.updateText(textCanvas);

					
					
					this.players.push({
						key: curData.key,
						name: curData.name,
						mesh: mesh,
						textCanvas: textCanvas
					});
				} else {

					console.log(curData);
				}
			}

			gsap.killTweensOf(this.camera.position, 'x,y,z');
			gsap.to(this.camera.position, {
				x: ((this.players.length - 1) * 3) / 2,
				y: this.players.length * 1 + 3,
				z: this.players.length * 1 + 5,
				duration: 1.2,
				ease: 'power2.inOut',
				onUpdate: () => {
					this.camera.lookAt(new THREE.Vector3(this.camera.position.x, 0, 0));
				},
			});
		} else if (this.players.length > curDataCollection.length) {
			const newPlayers = [];
			for (let ii = 0; ii < this.players.length; ii = ii + 1) {
				const player = this.players[ii];
				let isRemove = true;
				for (let j = 0; j < curDataCollection.length; j++) {
					if (curDataCollection[j].key === player.key) {
						isRemove = false;
					}
				}

				if (isRemove) {
					const mesh = player.mesh;
					gsap.killTweensOf(mesh.scale, 'x,y,z');
					gsap.to(mesh.scale, {
						duration: 0.8,
						x: 0.01,
						y: 0.01,
						z: 0.01,
						ease: 'power2.out',
						onComplete: () => {
							this.scene.remove(mesh);
						},
					});
				} else {
					newPlayers.push(player);
				}
			}

			// updateposition
			this.players = newPlayers;
			for (let ii = 0; ii < this.players.length; ii = ii + 1) {
				gsap.to(this.players[ii].mesh.position, {
					x: ii * 3,
					ease: 'power4.inOut',
					duration: 0.8,
				});
			}

			gsap.killTweensOf(this.camera.position, 'x,y,z');
			gsap.to(this.camera.position, {
				x: ((this.players.length - 1) * 3) / 2,
				y: this.players.length * 1 + 3,
				z: this.players.length * 1 + 5,
				duration: 1.2,
				ease: 'power2.inOut',
				onUpdate: () => {
					this.camera.lookAt(new THREE.Vector3(this.camera.position.x, 0, 0));
				},
			});
		} else {

		}
	}

	updateText(canvas){
		var ctx = canvas.getContext('2d');
		ctx.font = 'normal bold 60px sans-serif';
		ctx.textAlign = 'center';


	}
}
