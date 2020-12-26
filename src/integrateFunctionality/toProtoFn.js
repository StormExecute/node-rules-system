const settings = require("../_settings/store");

const {

	ArrayIndexOf,
	ReflectApply,

} = require("../_data/primordials");

const checkAccess = require("./checkAccess");

const getCallerPaths = require("../getCallerPaths");
const getCallerFnName = require("../getCallerFnName");

const returnProxy = require("../returnProxy");

const debug = require("../_debug");

const { logsEmitter } = require("../logs");

function integrateToProtoFns (whiteList, fnName, origin, backup, backupProp, allowList, fullBlock) {

	backup[backupProp] = origin.prototype[fnName];

	origin.prototype[fnName] = function (...args) {

		//NODE-RULES-SYSTEM-SIGNATURE

		if(fullBlock) return returnProxy;

		const callerPaths = getCallerPaths();

		if(!callerPaths.length) {

			logsEmitter("callProtoFn", [], {

				grantRights: false,

				protoFn: fnName,
				args,

			});

			debug.integrate("toProtoFn->false", callerPaths);

			return returnProxy;

		}

		debug.integrate("toProtoFn->true", callerPaths);

		if(
			(
				!settings.useIsCallerPathInsteadTrustedAllowList
				&&
				~ArrayIndexOf( allowList, callerPaths[0] )
			)
			||
			(
				settings.useIsCallerPathInsteadTrustedAllowList
				&&
				!getCallerPaths.isCallerPath( callerPaths[0] )
			)
		) {

			return ReflectApply(backup[backupProp], this, args);

		}

		for(let i = 0; i < whiteList.length; ++i) {

			const {

				customHandler,

			} = whiteList[i];

			let access = false;

			if(typeof customHandler == "function") {

				access = !!customHandler("callProtoFn", {

					callerPaths,
					callerFnName: getCallerFnName(),

					args,

					origin,

					protoFn: fnName,

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

				logsEmitter("callProtoFn", callerPaths, {

					grantRights: true,

					protoFn: fnName,
					args,

				});

				return ReflectApply(backup[backupProp], this, args);

			}

		}

		logsEmitter("callProtoFn", callerPaths, {

			grantRights: false,

			protoFn: fnName,
			args,

		});

		debug.integrate("toProtoFn->", false);

		return returnProxy;

	};

}

module.exports = integrateToProtoFns;