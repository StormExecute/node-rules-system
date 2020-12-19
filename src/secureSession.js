const { prefixS } = require("./_data");
const { password, mustBeString, wrongPass } = require("./password");

const {

	ObjectAssign,
	ArrayForEach,

} = require("./_data/primordials");

const checkAccess = require("./integrateFunctionality/checkAccess");

const getCallerPaths = require("./getCallerPaths");
const getCallerFnName = require("./getCallerFnName");

const { addPathsToWhiteList } = require("./whiteListFunctionality");

const { logsEmitter, wrongPassEmitter } = require("./logs");

const debug = require("./_debug");

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

	const whiteList = [];
	whiteList.name = "secureSession";

	return function session (tryPass, ...args) {

		if(typeof tryPass != "string") throw new Error(mustBeString);

		if(!password.value) {

			password.value = tryPass;

			logsEmitter.force("setPassword", null, { where: "secureSession" });

		} else if(tryPass != password.value) return wrongPassEmitter(wrongPass, "secureSession", { args });

		const whiteListResult = addPathsToWhiteList(whiteList, tryPass, args);

		if(!whiteListResult) throw new Error(prefixS + "To create a secure session, you need to give it paths!");

		const $sessionConfigs = {

			returnSession: false,

		};

		const $session = {

			getConfigs(){},

			setReturn(newState){},

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

				beforeWrapper(id, code){},
				beforeSecureRequire(id, code){},
				beforeMainCode(id, code){},

				afterMainCode(id, code){},
				afterWrapper(id, code){},

				beforeWrapperRemove(id){},
				beforeSecureRequireRemove(id){},
				beforeMainCodeRemove(id){},

				afterMainCodeRemove(id){},
				afterWrapperRemove(id){},

				getWrapper(){},

				useSecureRequirePatch(whiteFilenames){},
				useDependencyController(argsObject){},

				offSecureRequirePatch(){},
				offDependencyController(){},

				restoreOriginalRequire(){},

			},

			settings: {

				get(){},

				useIsCallerPathInsteadTrustedAllowList(status){},

				setChangeModuleRandomSignInterval(ms, immediately){},

				throwIfWrongPassword(){},
				dontThrowIfWrongPassword(){},

				setCorePath(path){},
				$getCorePath(){},

			},

			getAllLogs(){},
			getLogsEmitter(){},

			startRecordLogs(){},
			stopRecordLogs(){},

			fullSecure(status){},
			setSecure(status, secureElements){},

		};

		const makeSecureWrapper = function (fn, NRSFnName, NRSFnPropName) {

			return function (...args) {

				const callerPaths = getCallerPaths();

				if (!callerPaths.length) {

					logsEmitter("callFromSecureSession", [], {

						grantRights: false,

						NRSFnName,
						NRSFnPropName,
						args

					});

					debug.other("callFromSecureSession->false", callerPaths);

					return false;

				}

				debug.other("callFromSecureSession->true", callerPaths);

				for (let i = 0; i < whiteList.length; ++i) {

					const {

						customHandler,

					} = whiteList[i];

					let access = false;

					if(typeof customHandler == "function") {

						access = !!customHandler("callFromSecureSession", {

							callerPaths,
							callerFnName: getCallerFnName(),

							args,

							NRSFnName,
							NRSFnPropName,

						});

					} else {

						const {

							paths,
							blackPaths,

							callerFnName,
							onlyWhited,
							everyWhite,
							fullIdentify,

						} = whiteList[i];

						access = checkAccess({

							callerPaths,

							paths,
							blackPaths,

							callerFnName,
							onlyWhited,
							everyWhite,
							fullIdentify,

						});

					}

					if(access) {

						logsEmitter("callFromSecureSession", callerPaths, {

							grantRights: true,

							NRSFnName,
							NRSFnPropName,
							args

						});

						return fn(...args);

					}

				}

				logsEmitter("callFromSecureSession", callerPaths, {

					grantRights: false,

					NRSFnName,
					NRSFnPropName,
					args

				});

				debug.other("callFromSecureSession->", false);

				return false;

			};

		};

		const setSecureSessionProperty = function (prop, fn) {

			$session[prop] = makeSecureWrapper(fn, "session", prop);

		};

		setSecureSessionProperty("getConfigs", () => ObjectAssign({}, $sessionConfigs) );
		setSecureSessionProperty("setReturn", function (newState) {

			if (typeof newState != "boolean") return false;

			$sessionConfigs.returnSession = newState;

			return true;

		});

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

			$session.connections[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, connections, ...args);

			}, "connections", fnProp);

		});

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.fs[ standardMethods[i] ] = makeSecureWrapper(function (...args) {

				return standardWrapper(standardMethods[i], fs, ...args);

			}, "fs", standardMethods[i]);

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

			$session.process[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, process, ...args);

			}, "process", fnProp);

		});

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.child_process[ standardMethods[i] ] = makeSecureWrapper(function (...args) {

				return standardWrapper(standardMethods[i], child_process, ...args);

			}, "child_process", standardMethods[i]);

		}

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.dgram[ standardMethods[i] ] = makeSecureWrapper(function (...args) {

				return standardWrapper(standardMethods[i], dgram, ...args);

			}, "dgram", standardMethods[i]);

		}

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.worker_threads[ standardMethods[i] ] = makeSecureWrapper(function (...args) {

				return standardWrapper(standardMethods[i], worker_threads, ...args);

			}, "worker_threads", standardMethods[i]);

		}

		for (let i = 0; i < standardMethods.length; ++i) {

			$session.cluster[ standardMethods[i] ] = makeSecureWrapper(function (...args) {

				return standardWrapper(standardMethods[i], cluster, ...args);

			}, "cluster", standardMethods[i]);

		}

		ArrayForEach([

			"get",

			"useIsCallerPathInsteadTrustedAllowList",

			"setChangeModuleRandomSignInterval",

			"throwIfWrongPassword",
			"dontThrowIfWrongPassword",

			"setCorePath",
			"$getCorePath",

		], fnProp => {

			$session.settings[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, settings, ...args);

			}, "settings", fnProp);

		});

		ArrayForEach([

			"getAllLogs",
			"getLogsEmitter",

			"startRecordLogs",
			"stopRecordLogs",

		], fnProp => {

			$session[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, nrsCoreFns, ...args);

			}, "logs", fnProp);

		});

		ArrayForEach([

			"fullSecure",
			"enableFullSecure",
			"disableFullSecure",

			"setSecure",
			"setSecureEnable",
			"setSecureDisable",

		], fnProp => {

			$session[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, nrsCoreFns, ...args);

			}, "fullOrSetSecure", fnProp);

		});

		ArrayForEach([

			"isReturnProxy",

		], fnProp => {

			$session[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, nrsCoreFns, ...args);

			}, "NRSCore", fnProp);

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

			$session.timers[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, timers, ...args);

			}, "timers", fnProp);

		});

		ArrayForEach([

			"beforeWrapper",
			"beforeSecureRequire",
			"beforeMainCode",

			"afterMainCode",
			"afterWrapper",

			"beforeWrapperRemove",
			"beforeSecureRequireRemove",
			"beforeMainCodeRemove",

			"afterMainCodeRemove",
			"afterWrapperRemove",

			"getWrapper",

			"useSecureRequirePatch",
			"useDependencyController",

			"offSecureRequirePatch",
			"offDependencyController",

			"restoreOriginalRequire",

		], fnProp => {

			$session.module[fnProp] = makeSecureWrapper(function (...args) {

				return standardWrapper(fnProp, modules, ...args);

			}, module, fnProp);

		});

		ArrayForEach([

			"$tls",
			"$net",
			"$http",
			"$https",
			"$http2",

		], fnProp => {

			$session.connections[fnProp] = {

				get: makeSecureWrapper(function (propName) {

					return getWrapper(fnProp, connections, propName);

				}, "connections.get", fnProp)

			};

		});

		ArrayForEach([

			"$fs",
			"$fsPromises",

		], fnProp => {

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

		$session.timers.$fns = {

			get: makeSecureWrapper(function (propName) {

				return getWrapper("$fns", timers, propName);

			}, "timers.get", "$fns")

		};

		return ObjectAssign({}, $session);

	}

}

module.exports = makeSession;