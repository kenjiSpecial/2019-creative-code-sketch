'use strict';

import App from './index';

let app;

(() => {
	init();
	start();
})();

function init() {
	app = new App({
		isDebug: true
	});

	document.body.appendChild(app.dom);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function start() {
	// app.animateIn();
	app.loadTexture();
}

function onDocumentMouseMove(event) {
	let mouseX = event.clientX / window.innerWidth * 2 - 1;
	let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	app.onMouseMove({ x: mouseX, y: mouseY });
}

window.addEventListener('resize', function() {
	app.resize();
});

window.addEventListener('keydown', function(ev) {
	app.onKeyDown(ev);
});
