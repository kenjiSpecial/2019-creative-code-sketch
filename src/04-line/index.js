import * as THREE from 'three';
import fragmentShaderSrc from './shader.frag';
import vertexShaderSrc from './shader.vert';

import dat from 'dat.gui';
import Stats from 'stats.js';

import TweenMax, { Expo, Power4 } from 'gsap/TweenMax';

export default class App {
	constructor(params) {
		this.params = params || {};
		this.target = { x: 0, y: 0 };
		this.mouse = { x: 0, y: 0 };

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
		this.cameraFov = 45;
		this.camera = new THREE.PerspectiveCamera(
			this.cameraFov,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		this.camera.position.z = 12;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.targetPointZ = 0;

		const dZ = this.camera.position.z - this.targetPointZ;
		this.cameraAreaHeight = Math.tan((this.cameraFov / 2 / 180) * Math.PI) * dZ;
		this.cameraAreaWidth = (this.cameraAreaHeight / window.innerHeight) * window.innerWidth;
	}

	makeUtils() {
		this.clock = new THREE.Clock();
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
		this.bufferGeometry = new THREE.BufferGeometry();

		this.lineSegments = 40;
		this.lineSize = 201;

		var positions = [];
		var initPositions = [];
		var indices = [];

		const z = 0;
		var lastIndex = 0;
		for (let jj = 0; jj < this.lineSize; jj = jj + 1) {
			const rate = jj / (this.lineSize - 1);
			const x = this.cameraAreaWidth * rate * 2 - this.cameraAreaWidth;
			const initX =
				jj < this.lineSize / 2
					? this.cameraAreaWidth * (Math.random() * 0.2+ 0.9)
					: -this.cameraAreaWidth * (Math.random() + 0.9);

			const cnt = jj * this.lineSegments;

			for (let ii = 0; ii < this.lineSegments; ii = ii + 1) {
				const yRate = ii / (this.lineSegments - 1);

				const y = this.cameraAreaHeight * (yRate * 2 - 1);
				positions.push(x, y, z);
				initPositions.push(initX, y, z);

				if (ii < this.lineSegments - 1) {
					indices.push(cnt + ii, cnt + ii + 1);
					lastIndex = cnt + ii + 1;
				}
			}
		}

		lastIndex = lastIndex + 1;

		for (let jj = 0; jj < this.lineSize; jj = jj + 1) {
			const rate = jj / (this.lineSize - 1);
			const y = this.cameraAreaHeight * rate * 2 - this.cameraAreaHeight;
			const initY =
				jj < this.lineSize / 2
					? this.cameraAreaHeight * (Math.random() * 0.2 + 0.9)
					: -this.cameraAreaHeight * (Math.random() * 0.2 + 0.9);

			const cnt = jj * this.lineSegments + lastIndex;

			for (let ii = 0; ii < this.lineSegments; ii = ii + 1) {
				const xRate = ii / (this.lineSegments - 1);

				const x = this.cameraAreaWidth * (xRate * 2 - 1);
				positions.push(x, y, z);
				initPositions.push(x, initY, z);

				if (ii < this.lineSegments - 1) {
					indices.push(cnt + ii, cnt + ii + 1);
				}
			}
		}

		this.bufferGeometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3)
		);
		this.bufferGeometry.setAttribute(
			'initPosition',
			new THREE.Float32BufferAttribute(initPositions, 3)
		);
		this.bufferGeometry.setIndex(indices);

		this.material = new THREE.RawShaderMaterial({
			vertexShader: vertexShaderSrc,
			fragmentShader: fragmentShaderSrc,
			uniforms: {
				uTexture: { value: null },
				uScale: { value: window.innerWidth / window.innerHeight },
				uMouse: { value: new THREE.Vector2(0, 0) },
				uTime: { value: 0 }
			}
		});
		this.mesh = new THREE.LineSegments(this.bufferGeometry, this.material);

		this.scene.add(this.mesh);
	}

	loadTexture() {
		var loader = new THREE.TextureLoader();
		var self = this;
		loader.load(
			// resource URL
			'face.jpg',

			// onLoad callback
			function(texture) {
				// in this example we create the material when the texture is loaded

				self.material.uniforms.uTexture.value = texture;
				self.animateIn();
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function(err) {
				console.error('An error happened.');
			}
		);
	}

	animateIn() {
		this.isLoop = true;
		TweenMax.ticker.addEventListener('tick', this.loop, this);
	}

	loop() {
		this.mouse.x += (this.target.x - this.mouse.x) * 0.05;
		this.mouse.y += (this.target.y - this.mouse.y) * 0.05;

		this.material.uniforms.uMouse.value.x = this.mouse.x;
		this.material.uniforms.uMouse.value.y = this.mouse.y;
		this.material.uniforms.uTime.value = this.material.uniforms.uTime.value + 1 / 60;

		this.renderer.render(this.scene, this.camera);
		if (this.stats) this.stats.update();
	}

	animateOut() {
		TweenMax.ticker.removeEventListener('tick', this.loop, this);
	}

	onMouseMove(mouse) {
		// console.log(mouse);
		this.target.x = mouse.x;
		this.target.y = mouse.y;
	}

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
