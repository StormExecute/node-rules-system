const makeGet = require("./getFunctionality");

const getWhiteListFunctionality = function (fns) {

	return {

		addFullPathToWhiteList: fns.addFullPathToWhiteList,
		addProjectPathToWhiteList: fns.addProjectPathToWhiteList,
		addDependencyToWhiteList: fns.addDependencyToWhiteList,
		addDependencyPathToWhiteList: fns.addDependencyPathToWhiteList,

	};

};

const {

	$tls,
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

} = require("./connections/block");

const connections = getWhiteListFunctionality(require("./connections/addToWhiteList"));

connections.$tls = { get: makeGet($tls) };
connections.$net = { get: makeGet($net) };
connections.$http = { get: makeGet($http) };
connections.$https = { get: makeGet($https) };
connections.$http2 = { get: makeGet($http2) };

connections.block = blockConnections;
connections.allow = allowConnections;

connections.integrateToNet = integrateToNet;
connections.integrateToHttp = integrateToHttp;
connections.integrateToHttps = integrateToHttps;
connections.integrateToHttp2 = integrateToHttp2;

connections.integrateToHttpAgent = integrateToHttpAgent;
connections.integrateToHttpClient = integrateToHttpClient;
connections.integrateToTls = integrateToTls;
connections.integrateToTlsWrap = integrateToTlsWrap;

connections.restoreNet = restoreNet;
connections.restoreHttp = restoreHttp;
connections.restoreHttps = restoreHttps;
connections.restoreHttp2 = restoreHttp2;

connections.restoreHttpAgent = restoreHttpAgent;
connections.restoreHttpClient = restoreHttpClient;
connections.restoreTls = restoreTls;
connections.restoreTlsWrap = restoreTlsWrap;

const {

	$fs,
	$fsPromises,

	fsBlockWriteAndChange,
	fsAllowWriteAndChange,

} = require("./fs/block");

const fs = getWhiteListFunctionality(require("./fs/addToWhiteList"));

fs.block = fsBlockWriteAndChange;
fs.allow = fsAllowWriteAndChange;

fs.$fs = { get: makeGet($fs) };
fs.$fsPromises = { get: makeGet($fsPromises) };

const { setPassword: init, changePassword: reInit } = require("./password");

const makeSession = require("./session");
const makeSecureSession = require("./secureSession");

module.exports = {

	init,
	reInit,

	session: makeSession(connections),
	secureSession: makeSecureSession(connections),

	connections,
	fs,

};