const { password, needToSetPassword, wrongPass } = require("../password");

const getCallerPaths = require("../getCallerPaths");

const { whiteList } = require("./addToWhiteList");

const tls = require('tls');
const net = require("net");
const http = require("http");
const http2 = require("http2");
const https = require("https");

const _tls_wrap = require("_tls_wrap");
const _http_agent = require("_http_agent");
const _http_client = require("_http_client");

const returnProxy = require("../returnProxy");

const $tls = {

	status: false,

	connect: null,
	socketProtoConnect: null,

};

const _tls = {

	status: false,

	connect: null,
	socketProtoConnect: null,

};

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

	Client: null,
	createClient: null,

};

const _httpAgent = {

	status: false,

	Agent: null,
	globalAgent: null,

};

const _httpClient = {

	status: false,

	ClientRequest: null,

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

function integrateToTls(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($tls.status == true) return false;

	integrateToFns(whiteList, ["connect"], tls, $tls);

	integrateToProtoFn(whiteList, "connect", tls.TLSSocket, $tls, "socketProtoConnect", ["net.js", "_tls_wrap.js"]);

	return $tls.status = true;

}

function integrateToTlsWrap(tryPass) {

	if (password.value === null) throw new Error(needToSetPassword);
	if (tryPass != password.value) throw new Error(wrongPass);

	if (_tls.status == true) return false;

	integrateToFns(whiteList, ["connect"], _tls_wrap, _tls);

	integrateToProtoFn(whiteList, "connect", _tls_wrap.TLSSocket, _tls, "socketProtoConnect", ["net.js", "_tls_wrap.js"]);

	return _tls.status = true;

}

function integrateToNet(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($net.status == true) return false;

	integrateToFns(whiteList, ["connect", "createConnection", "createQuicSocket"], net, $net);

	["Socket", "Stream"].forEach(el => {

		integrateToProtoFn(whiteList, "connect", net[el], $net, el + "PrototypeConnect", ["net.js", "_tls_wrap.js"]);

	});

	return $net.status = true;

}

function integrateToHttpAgent(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_httpAgent.status == true) return false;

	integrateToFns(whiteList, ["Agent"], _http_agent, _httpAgent);

	integrateToObject(whiteList, "globalAgent", _http_agent, _httpAgent, ["_http_client.js", "_http_agent.js"])

	return _httpAgent.status = true;

}

function integrateToHttpClient(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_httpClient.status == true) return false;

	integrateToFns(whiteList, ["ClientRequest"], _http_client, _httpClient)

	return _httpClient.status = true;

}

function integrateToHttp(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http.status == true) return false;

	integrateToFns(whiteList, ["Agent", "ClientRequest", "get", "request", "Client", "createClient"], http, $http);

	integrateToObject(whiteList, "globalAgent", http, $http, ["_http_client.js", "_http_agent.js"]);

	return $http.status = true;

}

function integrateToHttps(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($https.status == true) return false;

	integrateToFns(whiteList, ["Agent", "get", "request"], https, $https);

	integrateToObject(whiteList, "globalAgent", https, $https, ["_http_client.js", "_http_agent.js", "_https.js"]);

	return $https.status = true;

}

function integrateToHttp2(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http2.status == true) return false;

	integrateToFns(whiteList, ["connect"], http2, $http2);

	return $http2.status = true;

}

function restoreTls(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($tls.status == false) return false;

	restore(["connect"], tls, $tls);

	tls.TLSSocket.prototype.connect = $tls.socketProtoConnect;
	$tls.socketProtoConnect = null;

	$tls.status = false;

	return true;

}

function restoreTlsWrap(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_tls.status == false) return false;

	restore(["connect"], _tls_wrap, _tls);

	_tls_wrap.TLSSocket.prototype.connect = _tls.socketProtoConnect;
	_tls.socketProtoConnect = null;

	_tls.status = false;

	return true;

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

	$net.status = false;

	return true;

}

function restoreHttpAgent(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_httpAgent.status == false) return false;

	restore(["Agent", "globalAgent"], _http_agent, _httpAgent);

	_httpAgent.status = false;

	return true;

}

function restoreHttpClient(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_httpClient.status == false) return false;

	restore(["ClientRequest"], _http_client, _httpClient)

	_httpClient.status = false;

	return true;

}

function restoreHttp(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http.status == false) return false;

	restore(["Agent", "globalAgent", "ClientRequest", "get", "request"], http, $http);

	$http.status = false;

	return true;

}

function restoreHttps(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($https.status == false) return false;

	restore(["Agent", "globalAgent", "get", "request"], https, $https)

	$https.status = false;

	return true;

}

function restoreHttp2(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http2.status == false) return false;

	restore(["connect"], http2, $http2)

	$http2.status = false;

	return true;

}

function blockConnections(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	const result = [

		integrateToNet(tryPass),

		integrateToHttp(tryPass),
		integrateToHttps(tryPass),

		integrateToHttp2(tryPass),

		integrateToHttpAgent(tryPass),
		integrateToHttpClient(tryPass),

		integrateToTls(tryPass),
		integrateToTlsWrap(tryPass),

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

		restoreHttp2(tryPass),

		restoreHttpAgent(tryPass),
		restoreHttpClient(tryPass),

		restoreTls(tryPass),
		restoreTlsWrap(tryPass),

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

	integrateToHttpAgent,
	integrateToHttpClient,
	integrateToTls,
	integrateToTlsWrap,

	restoreNet,
	restoreHttp,
	restoreHttps,
	restoreHttp2,

	restoreHttpAgent,
	restoreHttpClient,
	restoreTls,
	restoreTlsWrap,

	blockConnections,
	allowConnections,

};