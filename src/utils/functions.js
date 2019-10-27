export function getAjaxJson(url, callback) {
	// let promiseObj = new Promise(function(resolve, reject) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	//    xhr.responseType = 'json';

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {

				var resp = xhr.responseText;
				var respJson = JSON.parse(resp);
				callback(respJson);
			} else {
				callback(xhr.status);
			}
		} else {
			// console.log('xhr processing going on');
		}
	};

    xhr.send();
}