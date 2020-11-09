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

} = require("./connections/store");

const {

	integrateToNet,
	integrateToHttp,
	integrateToHttps,
	integrateToHttp2,

	integrateToHttpAgent,
	integrateToHttpClient,
	integrateToTls,
	integrateToTlsWrap,

	blockConnections,

} = require("./connections/block");

const {

	restoreNet,
	restoreHttp,
	restoreHttps,
	restoreHttp2,

	restoreHttpAgent,
	restoreHttpClient,
	restoreTls,
	restoreTlsWrap,

	allowConnections,

} = require("./connections/allow");

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

} = require("./fs/store");

const fs = getWhiteListFunctionality(require("./fs/addToWhiteList"));

fs.block = require("./fs/block");
fs.allow = require("./fs/allow");

fs.$fs = { get: makeGet($fs) };
fs.$fsPromises = { get: makeGet($fsPromises) };

const blockBindings = require("./process/blockBindings");
const allowBindings = require("./process/allowBindings");

const process = {

	blockBinding: blockBindings["binding"],
	blockLinkedBinding: blockBindings["_linkedBinding"],
	blockDlopen: blockBindings["dlopen"],

	blockBindingLinkedBindingAndDlopen: blockBindings.blockAll,

	block: blockBindings.blockAll,

	allowBinding: allowBindings.allowBinding,
	allowLinkedBinding: allowBindings.allowLinkedBinding,
	allowDlopen: allowBindings.allowDlopen,

	allowBindingLinkedBindingAndDlopen: allowBindings.allowAll,

	allow: blockBindings.blockAll,

};

process.$fns = { get: makeGet(require("./process/storeBindings")) };

const child_process = getWhiteListFunctionality(require("./child_process/addToWhiteList"));

child_process.block = require("./child_process/block");
child_process.allow = require("./child_process/allow");

child_process.$fns = { get: makeGet(require("./child_process/store")) };

const dgram = getWhiteListFunctionality(require("./dgram/addToWhiteList"));

dgram.block = require("./dgram/block");
dgram.allow = require("./dgram/allow");

dgram.$fns = { get: makeGet(require("./dgram/store")) };

const worker_threads = getWhiteListFunctionality(require("./worker_threads/addToWhiteList"));

worker_threads.block = require("./worker_threads/block");
worker_threads.allow = require("./worker_threads/allow");

worker_threads.$fns = { get: makeGet(require("./worker_threads/store")) };

const cluster = getWhiteListFunctionality(require("./cluster/addToWhiteList"));

cluster.block = require("./cluster/block");
cluster.allow = require("./cluster/allow");

cluster.$fns = { get: makeGet(require("./cluster/store")) };

const {

	setPassword: init,
	changePassword: reInit,

	password,
	needToSetPassword,
	wrongPass,

} = require("./password");

const makeSession = require("./session");
const makeSecureSession = require("./secureSession");

const {

	getAllLogs,
	getLogsEmitter,

	startRecordLogs,
	stopRecordLogs,

} = require("./logs").make(password, needToSetPassword, wrongPass);

const settings = require("./_settings/main");

const makeFullSecure = require("./fullSecure");
const makeSetSecure = require("./setSecure");

const fullSecure = makeFullSecure(
	connections, fs,
	process, child_process, dgram, worker_threads, cluster
);
const setSecure = makeSetSecure(
	connections, fs,
	process, child_process, dgram, worker_threads, cluster
);

module.exports = {

	getAllLogs,
	getLogsEmitter,

	startRecordLogs,
	stopRecordLogs,

	settings,

	init,
	reInit,

	session: makeSession(
		connections, fs,
		process, child_process, dgram, worker_threads, cluster,
		settings,
		{
			getAllLogs,
			getLogsEmitter,
			startRecordLogs,
			stopRecordLogs,
			fullSecure,
			setSecure,
		}
	),
	secureSession: makeSecureSession(
		connections, fs,
		process, child_process, dgram, worker_threads, cluster,
		settings,
		{
			getAllLogs,
			getLogsEmitter,
			startRecordLogs,
			stopRecordLogs,
			fullSecure,
			setSecure,
		}
	),

	fullSecure,
	setSecure,

	connections,
	fs,

	process,

	child_process,
	dgram,
	worker_threads,
	cluster,

	isReturnProxy: require("./isReturnProxy"),

};