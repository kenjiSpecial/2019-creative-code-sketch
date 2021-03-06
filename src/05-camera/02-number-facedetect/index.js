import * as THREE from 'three';
import fragmentShaderSrc from './shader.frag';
import vertexShaderSrc from './shader.vert';
import dat from 'dat.gui';
import Stats from 'stats.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import TweenMax, { Expo, Power4 } from 'gsap/TweenMax';

const initGridSize = 80;
const personGridSize = 5;

export default class App {
	constructor(params) {
		this.params = params || {};
		this.detectFrame = this.detectFrame.bind(this);

		this.target = { x: 0, y: 0 };
		this.mouse = { x: 0, y: 0 };
		this.prevDetect;
		this.curDetect = false;

		this.makeRenderer();
		this.makeScene();
		this.makeCamera();
		this.makeTexture();
		this.makeGui();
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
		var width = window.innerWidth;
		var height = window.innerHeight;

		this.camera = new THREE.OrthographicCamera(
			width / -2,
			width / 2,
			height / 2,
			height / -2,
			1,
			1000
		);

		this.camera.position.z = 10;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
	}

	makeUtils() {
		this.clock = new THREE.Clock();
	}

	setupDebug() {
		this.makeStats();
		this.makeGui();
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

	makeTexture() {}

	makeMesh() {
		const plane = new THREE.PlaneGeometry(1, 1);
		const shaderMaterial = new THREE.RawShaderMaterial({
			vertexShader: vertexShaderSrc,
			fragmentShader: fragmentShaderSrc,
			uniforms: {
				uTexture: { value: this.texture },
				uFontTexture: { value: this.fontTexture },
				uGridSize: { value: initGridSize },
				uWindowSize: { value: new THREE.Vector2(this.videoWidth, this.videoHeight) }
			}
		});
		this.shaderMaterial = shaderMaterial;
		this.mesh = new THREE.Mesh(plane, shaderMaterial);

		this.scene.add(this.mesh);
	}

	async loadModel() {
		// ref: https://medium.com/@erdemisbilen/building-realtime-object-detection-webapp-with-tensorflow-js-and-angular-a4ff5062bdf1

		this.model = await cocoSsd.load('lite_mobilenet_v2');
	}

	detectFrame() {
		this.model.detect(this.video).then(predictions => {
			this.prevDetect = this.curDetect;
			this.curDetect = false;
			for (let ii = 0; ii < predictions.length; ii++) {
				if (predictions[ii].class === 'person') {
					this.curDetect = true;
					break;
				}
			}

			if (this.curDetect === true && this.prevDetect === false) {
				// this.shaderMaterial.uniforms.uGridSize.value = personGridSize;
				TweenMax.killTweensOf(this.shaderMaterial.uniforms.uGridSize);
				TweenMax.to(this.shaderMaterial.uniforms.uGridSize, 1.2, {
					value: personGridSize,
					ease: Power4.easeOut
				});
			} else if (this.curDetect === false && this.prevDetect === true) {
				// this.shaderMaterial.uniforms.uGridSize.value = initGridSize;
				TweenMax.killTweensOf(this.shaderMaterial.uniforms.uGridSize);
				TweenMax.to(this.shaderMaterial.uniforms.uGridSize, 1.2, {
					value: initGridSize,
					ease: Power4.easeOut
				});
			}

			requestAnimationFrame(() => {
				this.detectFrame();
			});
		});
	}

	loadVideo() {
		var video = document.createElement('video');
		var cnt = 0;
		var self = this;
		this.video = video;

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(function(stream) {
					video.srcObject = stream;
					self.video.play();

					var texture = new THREE.VideoTexture(video);
					texture.minFilter = THREE.LinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.format = THREE.RGBFormat;
					self.texture = texture;

					self.makeMesh();
					self.animateIn();

					video.onloadeddata = event => {
						console.log(
							'Yay! The readyState just increased to  ' +
								'HAVE_CURRENT_DATA or greater for the first time.'
						);
						self.detectFrame();
					};
				})
				.catch(function(err0r) {
					console.log('Something went wrong!');
				});
		}

		var self = this;
		var getVideoSize = function() {
			self.videoWidth = video.videoWidth;
			self.videoHeight = video.videoHeight;
			self.resizeVideo();
			video.removeEventListener('playing', getVideoSize, false);
		};

		// this.video.onloadedmetadata = () => {
		// 	this.video.play();};
		// 	});

		video.addEventListener('playing', getVideoSize, false);
		this.video = video;

		this.fontTexture = new THREE.TextureLoader().load('number_font.png');
		this.fontTexture.minFilter = THREE.LinearFilter;
		this.fontTexture.magFilter = THREE.LinearFilter;
		this.fontTexture.format = THREE.RGBAFormat;

		this.loadModel();
	}

	animateIn() {
		this.isLoop = true;
		TweenMax.ticker.addEventListener('tick', this.loop, this);
	}

	loop() {
		this.texture.needsUpdate = true;
		this.renderer.render(this.scene, this.camera);
		if (this.stats) this.stats.update();
	}

	animateOut() {
		TweenMax.ticker.removeEventListener('tick', this.loop, this);
	}

	onMouseMove(mouse) {
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
		var width = window.innerWidth;
		var height = window.innerHeight;

		this.renderer.setSize(width, height);

		this.camera.left = -width / 2;
		this.camera.right = width / 2;
		this.camera.top = height / 2;
		this.camera.bottom = -height / 2;
		this.camera.updateProjectionMatrix();

		if (this.video) {
			this.resizeVideo();
		}
	}

	resizeVideo() {
		console.log('resize video');
		var width = window.innerWidth;
		var height = window.innerHeight;
		console.log(this.videoWidth, this.videoHeight);
		let videoWidth, videoHeight;
		if ((this.videoHeight / this.videoWidth) * width > height) {
			videoWidth = width;
			videoHeight = (this.videoHeight / this.videoWidth) * videoWidth;
		} else {
			videoHeight = height;
			videoWidth = (this.videoWidth / this.videoHeight) * videoHeight;
		}
		this.videoWidth = videoWidth;
		this.videoHeight = videoHeight;

		this.mesh.scale.set(videoWidth, videoHeight, 1);
		if (this.shaderMaterial) {
			this.shaderMaterial.uniforms.uWindowSize.value.set(videoWidth, videoHeight);
		}
	}

	destroy() {}
}
