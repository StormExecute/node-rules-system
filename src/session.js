const { password, mustBeString } = require("./password");

const { logsEmitter } = require("./logs");

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
	timers,
	settings, nrsCoreFns
) {

	return function session (tryPass) {

		if(typeof tryPass != "string") throw new Error(mustBeString);

		if(!password.value) {

			password.value = tryPass;

			logsEmitter.force("setPassword", null, { where: "session" });

		}

		const $sessionConfigs = {

			returnSession: false,

		};

		const $session = {

			getConfigs() {

				return Object.assign({}, $sessionConfigs);

			},

			setReturn(newState) {

				if(typeof newState != "boolean") return false;

				$sessionConfigs.returnSession = newState;

				return true;

			},

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

			timers: {

				changeMaxGetUniqFnNameRecursiveCalls(newValue){},

				integrateToImmediate(){},
				integrateToProcessNextTick(){},

				integrate(){},

				restoreImmediate(){},
				restoreProcessNextTick(){},

				restore(){},

				$fns: { $get(propName){} },

			},

			settings: {

				throwIfWrongPassword(){},
				dontThrowIfWrongPassword(){},

			},

			getAllLogs(){},
			getLogsEmitter(){},

			startRecordLogs(){},
			stopRecordLogs(){},

			fullSecure(status){},
			setSecure(status, secureElements){},

		};

		const standartWrapper = function (fnProp, factory, ...args) {

			if($sessionConfigs.returnSession) {

				factory[fnProp](tryPass, ...args);

				return Object.assign({}, $session);

			} else {

				return factory[fnProp](tryPass, ...args);

			}

		};

		const getWrapper = function (fnProp, factory, propName) {

			if($sessionConfigs.returnSession) {

				factory[fnProp].get(tryPass, propName);

				return Object.assign({}, $session);

			} else {

				return factory[fnProp].get(tryPass, propName);

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

			$session.connections[fnProp] = function (...args) {

				return standartWrapper(fnProp, connections, ...args);

			}

		});

		standartMethods.forEach(fnProp => {

			$session.fs[fnProp] = function (...args) {

				return standartWrapper(fnProp, fs, ...args);

			}

		});

		[

			"blockBinding",
			"blockLinkedBinding",
			"blockDlopen",

			"blockBindingLinkedBindingAndDlopen",

			"block",

			"allowBinding",
			"allowLinkedBinding",
			"allowDlopen",

			"allowBindingLinkedBindingAndDlopen",

			"allow",

		].forEach(fnProp => {

			$session.process[fnProp] = function (...args) {

				return standartWrapper(fnProp, process, ...args);

			}

		});

		standartMethods.forEach(fnProp => {

			$session.child_process[fnProp] = function (...args) {

				return standartWrapper(fnProp, child_process, ...args);

			}

		});

		standartMethods.forEach(fnProp => {

			$session.dgram[fnProp] = function (...args) {

				return standartWrapper(fnProp, dgram, ...args);

			}

		});

		standartMethods.forEach(fnProp => {

			$session.worker_threads[fnProp] = function (...args) {

				return standartWrapper(fnProp, worker_threads, ...args);

			}

		});

		standartMethods.forEach(fnProp => {

			$session.cluster[fnProp] = function (...args) {

				return standartWrapper(fnProp, cluster, ...args);

			}

		});

		[

			"throwIfWrongPassword",
			"dontThrowIfWrongPassword",

		].forEach(fnProp => {

			$session.settings[fnProp] = function (...args) {

				return standartWrapper(fnProp, settings, ...args);

			}

		});

		[

			"getAllLogs",
			"getLogsEmitter",

			"startRecordLogs",
			"stopRecordLogs",

			"fullSecure",
			"enableFullSecure",
			"disableFullSecure",

			"setSecure",
			"setSecureEnable",
			"setSecureDisable",

			"isReturnProxy",

		].forEach(fnProp => {

			$session[fnProp] = function (...args) {

				return standartWrapper(fnProp, nrsCoreFns, ...args);

			}

		});

		[

			"changeMaxGetUniqFnNameRecursiveCalls",

			"integrateToImmediate",
			"integrateToProcessNextTick",

			"integrateToSetTimeout",
			"integrateToSetInterval",

			"integrateToPromiseThen",
			"integrateToPromiseCatch",

			"integrateToEventEmitterOn",

			"integrate",

			"restoreImmediate",
			"restoreProcessNextTick",

			"restoreSetTimeout",
			"restoreSetInterval",

			"restorePromiseThen",
			"restorePromiseCatch",

			"restoreEventEmitterOn",

			"restore",

		].forEach(fnProp => {

			$session.timers[fnProp] = function (...args) {

				return standartWrapper(fnProp, timers, ...args);

			}

		});

		[

			"$tls",
			"$net",
			"$http",
			"$https",
			"$http2",

		].forEach(fnProp => {

			$session.connections[fnProp] = {

				get: function (propName) {

					return getWrapper(fnProp, connections, propName);

				}

			}

		});

		[

			"$fs",
			"$fsPromises",

		].forEach(fnProp => {

			$session.fs[fnProp] = {

				get: function (propName) {

					return getWrapper(fnProp, fs, propName);

				}

			}

		});

		$session.process.$fns = {

			get: function (propName) {

				return getWrapper("$fns", process, propName);

			}

		};

		$session.child_process.$fns = {

			get: function (propName) {

				return getWrapper("$fns", child_process, propName);

			}

		};

		$session.dgram.$fns = {

			get: function (propName) {

				return getWrapper("$fns", dgram, propName);

			}

		};

		$session.worker_threads.$fns = {

			get: function (propName) {

				return getWrapper("$fns", worker_threads, propName);

			}

		};

		$session.cluster.$fns = {

			get: function (propName) {

				return getWrapper("$fns", cluster, propName);

			}

		};

		$session.timers.$fns = {

			get: function (propName) {

				return getWrapper("$fns", timers, propName);

			}

		};

		return Object.assign({}, $session);

	}

}

module.exports = makeSession;