const { password, mustBeString, wrongPass } = require("./password");

const {

	ObjectAssign,
	ArrayForEach,

} = require("./_data/primordials");

const { logsEmitter, wrongPassEmitter } = require("./logs");

const standardMethods = [

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

	"block",
	"allow",

];

const makeSession = function (
	connections, fs,
	process, child_process, dgram, worker_threads, cluster,
	timers, modules,
	settings, nrsCoreFns
) {

	return function session (tryPass) {

		if(typeof tryPass != "string") throw new Error(mustBeString);

		if(!password.value) {

			password.value = tryPass;

			logsEmitter.force("setPassword", null, { where: "session" });

		} else if(tryPass != password.value) return wrongPassEmitter(wrongPass, "session");

		const $sessionConfigs = {

			returnSession: false,

		};

		const $session = {

			getConfigs() {

				return ObjectAssign({}, $sessionConfigs);

			},

			setReturn(newState) {

				if(typeof newState != "boolean") return false;

				$sessionConfigs.returnSession = newState;

				return true;

			},

			connections: {

				addCustomPathsToWhiteList(...args){},
				addPathsToWhiteList(...args){},
				addDependencyAndPathsToWhiteList(...args){},
				addDependencyPathAndProjectPathsToWhiteList(...args){},

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

				addCustomPathsToWhiteList(...args){},
				addPathsToWhiteList(...args){},
				addDependencyAndPathsToWhiteList(...args){},
				addDependencyPathAndProjectPathsToWhiteList(...args){},

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

				addCustomPathsToWhiteList(...args){},
				addPathsToWhiteList(...args){},
				addDependencyAndPathsToWhiteList(...args){},
				addDependencyPathAndProjectPathsToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			dgram: {

				addCustomPathsToWhiteList(...args){},
				addPathsToWhiteList(...args){},
				addDependencyAndPathsToWhiteList(...args){},
				addDependencyPathAndProjectPathsToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			worker_threads: {

				addCustomPathsToWhiteList(...args){},
				addPathsToWhiteList(...args){},
				addDependencyAndPathsToWhiteList(...args){},
				addDependencyPathAndProjectPathsToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			cluster: {

				addCustomPathsToWhiteList(...args){},
				addPathsToWhiteList(...args){},
				addDependencyAndPathsToWhiteList(...args){},
				addDependencyPathAndProjectPathsToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			timers: {

				changeMaxGetUniqFnNameRecursiveCalls(newValue){},

				integrateToImmediate(){},
				integrateToProcessNextTick(){},

				integrateToSetTimeout(){},
				integrateToSetInterval(){},

				integrateToPromiseThen(){},
				integrateToPromiseCatch(){},

				integrateToEventEmitterOn(){},

				integrateToFsReadFile(){},
				integrateToFsWriteFile(){},

				integrate(){},

				restoreImmediate(){},
				restoreProcessNextTick(){},

				restoreSetTimeout(){},
				restoreSetInterval(){},

				restorePromiseThen(){},
				restorePromiseCatch(){},

				restoreEventEmitterOn(){},

				restoreFsReadFile(){},
				restoreFsWriteFile(){},

				restore(){},

				reset(){},

				$fns: { $get(propName){} },

			},

			module: {

				beforeWrapper(code){},
				beforeSecureRequire(code){},
				beforeMainCode(code){},

				afterMainCode(code){},
				afterWrapper(code){},

				getWrapper(){},

				useSecureRequirePatch(whiteFilenames){},
				restoreOriginalRequire(){},

			},

			settings: {

				throwIfWrongPassword(){},
				dontThrowIfWrongPassword(){},

				setCorePath(path){},

			},

			getAllLogs(){},
			getLogsEmitter(){},

			startRecordLogs(){},
			stopRecordLogs(){},

			fullSecure(status){},
			setSecure(status, secureElements){},

		};

		const standardWrapper = function (fnProp, factory, ...args) {

			if($sessionConfigs.returnSession) {

				factory[fnProp](tryPass, ...args);

				return ObjectAssign({}, $session);

			} else {

				return factory[fnProp](tryPass, ...args);

			}

		};

		const getWrapper = function (fnProp, factory, propName) {

			if($sessionConfigs.returnSession) {

				factory[fnProp].get(tryPass, propName);

				return ObjectAssign({}, $session);

			} else {

				return factory[fnProp].get(tryPass, propName);

			}

		};

		ArrayForEach([

			"addCustomPathsToWhiteList",
			"addPathsToWhiteList",
			"addDependencyAndPathsToWhiteList",
			"addDependencyPathAndProjectPathsToWhiteList",

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

		], fnProp => {

			$session.connections[fnProp] = function (...args) {

				return standardWrapper(fnProp, connections, ...args);

			}

		});

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.fs[ standardMethods[i] ] = function (...args) {

				return standardWrapper(standardMethods[i], fs, ...args);

			}

		}

		ArrayForEach([

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

		], fnProp => {

			$session.process[fnProp] = function (...args) {

				return standardWrapper(fnProp, process, ...args);

			}

		});

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.child_process[ standardMethods[i] ] = function (...args) {

				return standardWrapper(standardMethods[i], child_process, ...args);

			}

		}

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.dgram[ standardMethods[i] ] = function (...args) {

				return standardWrapper(standardMethods[i], dgram, ...args);

			}

		}

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.worker_threads[ standardMethods[i] ] = function (...args) {

				return standardWrapper(standardMethods[i], worker_threads, ...args);

			}

		}

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.cluster[ standardMethods[i] ] = function (...args) {

				return standardWrapper(standardMethods[i], cluster, ...args);

			}

		}

		ArrayForEach([

			"throwIfWrongPassword",
			"dontThrowIfWrongPassword",

			"setCorePath",
			"$getCorePath",

		], fnProp => {

			$session.settings[fnProp] = function (...args) {

				return standardWrapper(fnProp, settings, ...args);

			}

		});

		ArrayForEach([

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

		], fnProp => {

			$session[fnProp] = function (...args) {

				return standardWrapper(fnProp, nrsCoreFns, ...args);

			}

		});

		ArrayForEach([

			"changeMaxGetUniqFnNameRecursiveCalls",

			"integrateToImmediate",
			"integrateToProcessNextTick",

			"integrateToSetTimeout",
			"integrateToSetInterval",

			"integrateToPromiseThen",
			"integrateToPromiseCatch",

			"integrateToEventEmitterOn",

			"integrateToFsReadFile",
			"integrateToFsWriteFile",

			"integrate",

			"restoreImmediate",
			"restoreProcessNextTick",

			"restoreSetTimeout",
			"restoreSetInterval",

			"restorePromiseThen",
			"restorePromiseCatch",

			"restoreEventEmitterOn",

			"restoreFsReadFile",
			"restoreFsWriteFile",

			"restore",

			"reset",

		], fnProp => {

			$session.timers[fnProp] = function (...args) {

				return standardWrapper(fnProp, timers, ...args);

			}

		});

		ArrayForEach([

			"beforeWrapper",
			"beforeSecureRequire",
			"beforeMainCode",

			"afterMainCode",
			"afterWrapper",

			"getWrapper",

			"useSecureRequirePatch",
			"restoreOriginalRequire",

		], fnProp => {

			$session.module[fnProp] = function (...args) {

				return standardWrapper(fnProp, modules, ...args);

			}

		});

		ArrayForEach([

			"$tls",
			"$net",
			"$http",
			"$https",
			"$http2",

		], fnProp => {

			$session.connections[fnProp] = {

				get: function (propName) {

					return getWrapper(fnProp, connections, propName);

				}

			}

		});

		ArrayForEach([

			"$fs",
			"$fsPromises",

		], fnProp => {

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

		return ObjectAssign({}, $session);

	}

}

module.exports = makeSession;