const { password, mustBeString, wrongPass } = require("./password");

const getCallerPaths = require("./getCallerPaths");

const { addProjectPathToWhiteList } = require("./whiteListFunctionality");

const { logsEmitter, wrongPassEmitter } = require("./logs");

const standartMethods = [

	"addFullPathToWhiteList",
	"addProjectPathToWhiteList",
	"addDependencyToWhiteList",
	"addDependencyPathToWhiteList",

	"block",
	"allow",

];

const makeSession = function (
	connections, fs,
	process, child_process, dgram, worker_threads, cluster,
	settings, logs
) {

	const whiteList = [];

	return function session (password, ...args) {

		if(typeof password != "string") throw new Error(mustBeString);

		if(!password.value) {

			password.value = password;

		} else if(password != password.value) return wrongPassEmitter(wrongPass, "secureSession", { args });

		const whiteListResult = addProjectPathToWhiteList(whiteList, password, args);

		if(!whiteListResult) throw new Error("[node-rules-system] To create a secure session, you need to give it paths!");

		const $sessionConfigs = {

			returnSession: false,

		};

		const $session = {

			getConfigs(){},

			setReturn(newState){},

			connections: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$tls: { get(propName){} },
				$net: { get(propName){} },
				$http: { get(propName){} },
				$https: { get(propName){} },
				$http2: { get(propName){} },

				integrateToNet(fullBlock){},
				integrateToHttp(fullBlock){},
				integrateToHttps(fullBlock){},
				integrateToHttp2(fullBlock){},

				integrateToHttpAgent(fullBlock){},
				integrateToHttpClient(fullBlock){},
				integrateToTls(fullBlock){},
				integrateToTlsWrap(fullBlock){},

				restoreNet(fullBlock){},
				restoreHttp(fullBlock){},
				restoreHttps(fullBlock){},
				restoreHttp2(fullBlock){},

				restoreHttpAgent(fullBlock){},
				restoreHttpClient(fullBlock){},
				restoreTls(fullBlock){},
				restoreTlsWrap(fullBlock){},

				block(fullBlock){},
				allow(fullBlock){},

			},

			fs: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fs: { $get(propName){} },
				$fsPromises: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			process: {

				$fns: { $get(propName){} },

				blockBinding(options){},
				blockLinkedBinding(options){},
				blockDlopen(options){},

				blockBindingLinkedBindingAndDlopen(options){},

				allowBinding(options){},
				allowLinkedBinding(options){},
				allowDlopen(options){},

				allowBindingLinkedBindingAndDlopen(options){},

			},

			child_process: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			dgram: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			worker_threads: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			cluster: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			settings: {

				throwIfWrongPassword(){},
				dontThrowIfWrongPassword(){},

			},

			getAllLogs(){},
			getLogsEmitter(){},

			startRecordLogs(){},
			stopRecordLogs(){},

		};

		const makeSecureWrapper = function (fn, NRSFnName, NRSFnPropName) {

			return function (...args) {

				const callerPaths = getCallerPaths();

				if (!callerPaths) {

					logsEmitter("callFromSecureSession", [undefined, undefined], {

						grantRights: false,

						NRSFnName,
						NRSFnPropName,
						args

					});

					return false;

				}

				const [nativePath, wrapPath] = callerPaths;

				for (let i = 0; i < whiteList.length; ++i) {

					if (
						nativePath.startsWith(whiteList[i][0])
						&&
						wrapPath.startsWith(whiteList[i][1])
					) {

						logsEmitter("callFromSecureSession", [nativePath, wrapPath], {

							grantRights: true,

							NRSFnName,
							NRSFnPropName,
							args

						});

						return fn(...args);

					}

				}

				logsEmitter("callFromSecureSession", [nativePath, wrapPath], {

					grantRights: false,

					NRSFnName,
					NRSFnPropName,
					args

				});

				return false;

			};

		};

		const setSecureSessionProperty = function (prop, fn) {

			$session[prop] = makeSecureWrapper(fn, "session", prop);

		};

		setSecureSessionProperty("getConfigs", () => Object.assign({}, $sessionConfigs) );
		setSecureSessionProperty("setReturn", function (newState) {

			if (typeof newState != "boolean") return false;

			$sessionConfigs.returnSession = newState;

			return true;

		});

		const standartWrapper = function (fnProp, factory, ...args) {

			if($sessionConfigs.returnSession) {

				factory[fnProp](password, ...args);

				return Object.assign({}, $session);

			} else {

				return factory[fnProp](password, ...args);

			}

		};

		const getWrapper = function (fnProp, factory, propName) {

			if($sessionConfigs.returnSession) {

				factory[fnProp].get(password, propName);

				return Object.assign({}, $session);

			} else {

				return factory[fnProp].get(password, propName);

			}

		};

		[

			"addFullPathToWhiteList",
			"addProjectPathToWhiteList",
			"addDependencyToWhiteList",
			"addDependencyPathToWhiteList",

			"integrateToNet",
			"integrateToHttp",
			"integrateToHttps",
			"integrateToHttp2",

			"integrateToHttpAgent",
			"integrateToHttpClient",
			"integrateToTls",
			"integrateToTlsWrap",

			"restoreNet",
			"restoreHttp",
			"restoreHttps",
			"restoreHttp2",

			"restoreHttpAgent",
			"restoreHttpClient",
			"restoreTls",
			"restoreTlsWrap",

			"block",
			"allow",

		].forEach(fnProp => {

			$session.connections[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, connections, ...args);

			}, "connections", fnProp);

		});

		standartMethods.forEach(fnProp => {

			$session.fs[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, fs, ...args);

			}, "fs", fnProp);

		});

		[

			"blockBinding",
			"blockLinkedBinding",
			"blockDlopen",

			"blockBindingLinkedBindingAndDlopen",

			"allowBinding",
			"allowLinkedBinding",
			"allowDlopen",

			"allowBindingLinkedBindingAndDlopen",

		].forEach(fnProp => {

			$session.process[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, process, ...args);

			}, "process", fnProp);

		});

		standartMethods.forEach(fnProp => {

			$session.child_process[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, child_process, ...args);

			}, "child_process", fnProp);

		});

		standartMethods.forEach(fnProp => {

			$session.dgram[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, dgram, ...args);

			}, "dgram", fnProp);

		});

		standartMethods.forEach(fnProp => {

			$session.worker_threads[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, worker_threads, ...args);

			}, "worker_threads", fnProp);

		});

		standartMethods.forEach(fnProp => {

			$session.cluster[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, cluster, ...args);

			}, "cluster", fnProp);

		});

		[

			"throwIfWrongPassword",
			"dontThrowIfWrongPassword",

		].forEach(fnProp => {

			$session.settings[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, settings, ...args);

			}, "settings", fnProp);

		});

		[

			"getAllLogs",
			"getLogsEmitter",
			"startRecordLogs",
			"stopRecordLogs",

		].forEach(fnProp => {

			$session[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, logs, ...args);

			}, "logs", fnProp)

		});

		[

			"$tls",
			"$net",
			"$http",
			"$https",
			"$http2",

		].forEach(fnProp => {

			$session.connections[fnProp] = {

				get: makeSecureWrapper(function (propName) {

					return getWrapper(fnProp, connections, propName);

				}, "connections.get", fnProp)

			};

		});

		[

			"$fs",
			"$fsPromises",

		].forEach(fnProp => {

			$session.fs[fnProp] = {

				get: makeSecureWrapper(function (propName) {

					return getWrapper(fnProp, fs, propName);

				}, "fs.get", fnProp)

			}

		});

		$session.process.$fns = {

			get: makeSecureWrapper(function (propName) {

				return getWrapper("$fns", process, propName);

			}, "process.get", "$fns")

		};

		$session.child_process.$fns = {

			get: makeSecureWrapper(function (propName) {

				return getWrapper("$fns", child_process, propName);

			}, "child_process.get", "$fns")

		};

		$session.dgram.$fns = {

			get: makeSecureWrapper(function (propName) {

				return getWrapper("$fns", dgram, propName);

			}, "dgram.get", "$fns")

		};

		$session.worker_threads.$fns = {

			get: makeSecureWrapper(function (propName) {

				return getWrapper("$fns", worker_threads, propName);

			}, "worker_threads.get", "$fns")

		};

		$session.cluster.$fns = {

			get: makeSecureWrapper(function (propName) {

				return getWrapper("$fns", cluster, propName);

			}, "cluster.get", "$fns")

		};

		return Object.assign({}, $session);

	}

}

module.exports = makeSession;