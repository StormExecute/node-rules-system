const { isReturnProxy } = require("../" + NRS_PATH);

const http = require("http");

let canContinue = { value: false };

function requestFn(callback) {

	const req = http.request({

		host: "www.example.com"

	}, response => {

		let str = '';

		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {

			callback(str);

		});

	}).end();

	if(isReturnProxy(req)) {

		callback(false);

	}

}

requestFn(function (str) {

	if(str == false) {

		canContinue.value = true;

	} else {

		console.error("indexFunctionality: must be blocked!");
		process.exit(1);

	}

});

module.exports = {

	requestFn,
	canContinue,

};