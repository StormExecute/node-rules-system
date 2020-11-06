const { password, needToSetPassword, wrongPass } = require("../password");

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

const restore = require("../restore");

function restoreTls(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($tls.status == false) return false;

	restore(["connect"], tls, $tls);

	if($tls.socketProtoConnect) {

		tls.TLSSocket.prototype.connect = $tls.socketProtoConnect;
		$tls.socketProtoConnect = null;

	}

	$tls.status = false;

	return true;

}

function restoreTlsWrap(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(_tls.status == false) return false;

	restore(["connect"], _tls_wrap, _tls);

	if(_tls.socketProtoConnect) {

		_tls_wrap.TLSSocket.prototype.connect = _tls.socketProtoConnect;
		_tls.socketProtoConnect = null;

	}

	_tls.status = false;

	return true;

}

function restoreNet(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($net.status == false) return false;

	restore(["connect", "createConnection", "createQuicSocket"], net, $net);

	["Socket", "Stream"].forEach(el => {

		if($net[el + "PrototypeConnect"]) {

			net[el].prototype.connect = $net[el + "PrototypeConnect"];
			$net[el + "PrototypeConnect"] = null;

		}

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

	restoreNet,
	restoreHttp,
	restoreHttps,
	restoreHttp2,

	restoreHttpAgent,
	restoreHttpClient,
	restoreTls,
	restoreTlsWrap,

	allowConnections,

};