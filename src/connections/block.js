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

const debug = false;

const integrateToFns = require("../integrateToFns");
const restore = require("../restore");

function integrateToObject(name, origin, backup, allowList) {

	backup[name] = origin[name];

	origin[name] = new Proxy({}, {

		get(target,prop) {

			const callerPaths = getCallerPaths();

			debug && console.log(0.8, callerPaths, name);

			if(!callerPaths) return returnProxy;

			const [callerFile, dependencyPath] = callerPaths;

			debug && console.log(2, name, callerFile, dependencyPath);

			if(~allowList.indexOf(callerFile)) return backup[name][prop];

			for(let i = 0; i < whiteList.length; ++i) {

				if(
					callerFile.startsWith(whiteList[i][0])
					&&
					dependencyPath.startsWith(whiteList[i][1])
				) {

					return backup[name][prop];

				}

			}

			return returnProxy;

		}

	});

}

function integrateToNet(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($net.status == true) return false;

	integrateToFns(whiteList, ["connect", "createConnection", "Stream", "createQuicSocket"], net, $net);

	["Socket", "Stream"].forEach(el => {

		$net[el + "PrototypeConnect"] = net[el].prototype.connect;

		net[el].prototype.connect = function (...args) {

			const callerPaths = getCallerPaths();

			debug && console.log(0.5, callerPaths, el);

			if(!callerPaths) return returnProxy;

			const [callerFile, dependencyPath] = callerPaths;

			debug && console.log(1.5, el, callerFile, dependencyPath);

			if(callerFile == "net.js" || callerFile == "_tls_wrap.js") return $net[el + "PrototypeConnect"].apply(this, args);

			for(let i = 0; i < whiteList.length; ++i) {

				if(
					callerFile.startsWith(whiteList[i][0])
					&&
					dependencyPath.startsWith(whiteList[i][1])
				) {

					return $net[el + "PrototypeConnect"].apply(this, args);

				}

			}

			return returnProxy;

		};

	});

	$net.status = true;

	return true;

}

function integrateToHttp(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http.status == true) return false;

	integrateToFns(whiteList, ["Agent", "ClientRequest", "get", "request"], http, $http);

	integrateToObject("globalAgent", http, $http, ["_http_client.js", "_http_agent.js"]);

	$http.status = true;

	return true;

}

function integrateToHttps(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($https.status == true) return false;

	integrateToFns(whiteList, ["Agent", "get", "request"], https, $https);

	integrateToObject("globalAgent", https, $https, ["_http_client.js", "_http_agent.js", "https.js"]);

	$https.status = true;

	return true;

}

function integrateToHttp2(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($http2.status == true) return false;

	integrateToFns(whiteList, ["connect"], http2, $http2);

	$http2.status = true;

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