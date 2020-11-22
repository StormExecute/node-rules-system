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

		if(~allowList.indexOf(callerPaths[0])) {

			return backup[backupProp].apply(this, args);

		}

		for(let i = 0; i < whiteList.length; ++i) {

			const { callerFnName, paths } = whiteList[i];

			if(typeof callerFnName == "string") {

				if(getCallerFnName() != callerFnName) continue;

			}

			if( !callerPaths[0].startsWith( paths[0] ) ) {

				continue;

			}

			let l = 1;

			for(let j = 0; j < callerPaths.length; ++j) {

				if((l + 1) > paths.length) break;

				const callerPath = callerPaths[j];

				if( callerPath.startsWith( paths[l] ) ) {

					++l;

				}

			}

			if(l && l == paths.length) {

				logsEmitter("callProtoFn", callerPaths, {

					grantRights: true,

					protoFn: fnName,
					args,

				});

				return backup[backupProp].apply(this, args);

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