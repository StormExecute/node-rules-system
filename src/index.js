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

const getConnections = require("./connections/get");

const {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

} = require("./connections/addToWhiteList");

const connections = {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

};

connections.$tls = { get: getConnections($tls) };
connections.$net = { get: getConnections($net) };
connections.$http = { get: getConnections($http) };
connections.$https = { get: getConnections($https) };
connections.$http2 = { get: getConnections($http2) };

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

const { setPassword: init, changePassword: reInit } = require("./password");

module.exports = {

	init,
	reInit,

	connections,

}