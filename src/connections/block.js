const { password, needToSetPassword, wrongPass } = require("../password");

const getCallerPaths = require("../getCallerPaths");

const { whiteList } = require("./addToWhiteList");

const net = require("net");
const http = require("http");
const http2 = require("http2");
const https = require("https");

const returnProxy = require("../returnProxy");

const $net = {

	status: false,

	connect: null,
	createConnection: null,

	SocketPrototypeConnect: null,
	StreamPrototypeConnect: null,

};

const $http = {

	status: false,

	Agent: null,
	globalAgent: null,

	ClientRequest: null,

	get: null,
	request: null,

};

const $https = {

	status: false,

	Agent: null,
	globalAgent: null,

	get: null,
	request: null,

};

const $http2 = {

	status: false,

	connect: null,
	request: null,

};

const integrateToFns = require("../integrateFunctionality/toFns");
const integrateToObject = require("../integrateFunctionality/toObject");
const integrateToProtoFn = require("../integrateFunctionality/toProtoFn");

const restore = require("../restore");

function integrateToNet(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($net.status == true) return false;

	integrateToFns(whiteList, ["connect", "createConnection", "Stream", "createQuicSocket"], net, $net);

	["Socket", "Stream"].forEach(el => {

		integrateToProtoFn(whiteList, "connect", net[el], $net, el + "PrototypeConnect", ["net.js", "_tls_wrap.js"]);

	});

	return $net.status = true;

}

function integrateToHttp(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http.status == true) return false;

	integrateToFns(whiteList, ["Agent", "ClientRequest", "get", "request"], http, $http);

	integrateToObject("globalAgent", http, $http, ["_http_client.js", "_http_agent.js"]);

	return $http.status = true;

}

function integrateToHttps(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($https.status == true) return false;

	integrateToFns(whiteList, ["Agent", "get", "request"], https, $https);

	integrateToObject("globalAgent", https, $https, ["_http_client.js", "_http_agent.js", "https.js"]);

	return $https.status = true;

}

function integrateToHttp2(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http2.status == true) return false;

	integrateToFns(whiteList, ["connect"], http2, $http2);

	return $http2.status = true;

}

function restoreNet(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($net.status == false) return false;

	restore(["connect", "createConnection", "Stream", "createQuicSocket"], net, $net);

	["Socket", "Stream"].forEach(el => {

		net[el].prototype.connect = $net[el + "PrototypeConnect"];
		$net[el + "PrototypeConnect"] = null;

	});

	return $net.status = false;

}

function restoreHttp(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http.status == false) return false;

	restore(["Agent", "globalAgent", "ClientRequest", "get", "request"], http, $http);

	return $http.status = false;

}

function restoreHttps(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($https.status == false) return false;

	restore(["Agent", "globalAgent", "get", "request"], https, $https)

	return $https.status = false;

}

function restoreHttp2(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http2.status == false) return false;

	restore(["connect"], http2, $http2)

	return $http2.status = false;

}

function blockConnections(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	const result = [

		integrateToNet(tryPass),

		integrateToHttp(tryPass),
		integrateToHttps(tryPass),

		integrateToHttp2(tryPass)

	];

	return result;

}

function allowConnections(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	const result = [

		restoreNet(tryPass),

		restoreHttp(tryPass),
		restoreHttps(tryPass),

		restoreHttp2(tryPass)

	];

	return result;

}

module.exports = {

	$net,
	$http,
	$https,
	$http2,

	integrateToNet,
	integrateToHttp,
	integrateToHttps,
	integrateToHttp2,

	restoreNet,
	restoreHttp,
	restoreHttps,
	restoreHttp2,

	blockConnections,
	allowConnections,

};