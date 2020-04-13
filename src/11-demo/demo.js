'use strict';

import App from './index';

let app;

(() => {
	init();
	start();
})();

function init() {
	app = new App({
		isDebug: true,
	});

	const appEl = document.getElementById('root');
	appEl.appendChild(app.dom);

	var isSend = false;
	var btn = document.getElementById('btn');
	var inputText = document.getElementById('inputText');

	btn.addEventListener('click', function () {
		if (isSend) {
			return;
		}

		isSend = true;
		app.addPlayer(inputText.value);
	});
	var form = document.getElementById('form');
	form.addEventListener('submit', function (event) {
		console.log('submit');
		event.preventDefault();
	});
}

function start() {
	// app.start();
}

function onDocumentMouseMove(event) {
	let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

	app.onMouseMove({ x: mouseX, y: mouseY });
}

window.addEventListener('resize', function () {
	app.resize();
});

window.addEventListener('keydown', function (ev) {
	app.onKeyDown(ev);
});
