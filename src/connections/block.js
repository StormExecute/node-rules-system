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

const {

	$tls,
	$net,
	$http,
	$https,
	$http2,

	_tls,
	_httpAgent,
	_httpClient,

} = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");
const integrateToObject = require("../integrateFunctionality/toObject");
const integrateToProtoFn = require("../integrateFunctionality/toProtoFn");

function integrateToTls(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($tls.status == true) return false;

	integrateToFns(whiteList, ["connect"], tls, $tls, ["https.js", "internal/http2/core.js"], fullBlock);

	if(!tls.TLSSocket.prototype.connect.toString().match(/\/\/NODE-RULES-SYSTEM-SIGNATURE/)) {

		integrateToProtoFn(whiteList, "connect", tls.TLSSocket, $tls, "socketProtoConnect", ["net.js", "_tls_wrap.js", "https.js"], fullBlock);

	}

	return $tls.status = true;

}

function integrateToTlsWrap(tryPass, fullBlock) {

	if (password.value === null) throw new Error(needToSetPassword);
	if (tryPass != password.value) throw new Error(wrongPass);

	if (_tls.status == true) return false;

	integrateToFns(whiteList, ["connect"], _tls_wrap, _tls, ["https.js", "internal/http2/core.js"], fullBlock);

	if(!_tls_wrap.TLSSocket.prototype.connect.toString().match(/\/\/NODE-RULES-SYSTEM-SIGNATURE/)) {

		integrateToProtoFn(whiteList, "connect", _tls_wrap.TLSSocket, _tls, "socketProtoConnect", ["net.js", "_tls_wrap.js", "https.js"], fullBlock);

	}

	return _tls.status = true;

}

function integrateToNet(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($net.status == true) return false;

	integrateToFns(whiteList, ["connect", "createConnection", "createQuicSocket"], net, $net, ["internal/http2/core.js"], fullBlock);

	integrateToProtoFn(whiteList, "connect", net.Socket, $net, "SocketPrototypeConnect", ["net.js", "_tls_wrap.js"], fullBlock);

	if(!net.Stream.prototype.connect.toString().match(/\/\/NODE-RULES-SYSTEM-SIGNATURE/)) {

		integrateToProtoFn(whiteList, "connect", net.Stream, $net, "StreamPrototypeConnect", ["net.js", "_tls_wrap.js"], fullBlock);

	}

	return $net.status = true;

}

function integrateToHttpAgent(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_httpAgent.status == true) return false;

	integrateToFns(whiteList, ["Agent"], _http_agent, _httpAgent, [], fullBlock);

	if($http.status == false) {

		integrateToObject(whiteList, "globalAgent", _http_agent, _httpAgent, ["_http_client.js", "_http_agent.js"], fullBlock);

	} else {

		_httpAgent.globalAgent = $http.globalAgent;

	}

	return _httpAgent.status = true;

}

function integrateToHttpClient(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_httpClient.status == true) return false;

	integrateToFns(whiteList, ["ClientRequest"], _http_client, _httpClient, [], fullBlock);

	return _httpClient.status = true;

}

function integrateToHttp(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http.status == true) return false;

	integrateToFns(whiteList, ["Agent", "ClientRequest", "get", "request", "Client", "createClient"], http, $http, [], fullBlock);

	integrateToObject(whiteList, "globalAgent", http, $http, ["_http_client.js", "_http_agent.js"], fullBlock);

	return $http.status = true;

}

function integrateToHttps(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($https.status == true) return false;

	integrateToFns(whiteList, ["Agent", "get", "request"], https, $https, [], fullBlock);

	integrateToObject(whiteList, "globalAgent", https, $https, ["_http_client.js", "_http_agent.js", "_https.js", "https.js"], fullBlock);

	return $https.status = true;

}

function integrateToHttp2(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http2.status == true) return false;

	integrateToFns(whiteList, ["connect"], http2, $http2, [], fullBlock);

	return $http2.status = true;

}

function blockConnections(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	const result = [

		integrateToNet(tryPass, fullBlock),

		integrateToHttp(tryPass, fullBlock),
		integrateToHttps(tryPass, fullBlock),

		integrateToHttp2(tryPass, fullBlock),

		integrateToHttpAgent(tryPass, fullBlock),
		integrateToHttpClient(tryPass, fullBlock),

		integrateToTls(tryPass, fullBlock),
		integrateToTlsWrap(tryPass, fullBlock),

	];

	return result;

}

module.exports = {

	integrateToNet,
	integrateToHttp,
	integrateToHttps,
	integrateToHttp2,

	integrateToHttpAgent,
	integrateToHttpClient,
	integrateToTls,
	integrateToTlsWrap,

	blockConnections,

};