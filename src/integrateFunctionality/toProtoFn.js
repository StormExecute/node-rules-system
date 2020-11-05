const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = require("./debugThisFn");

const { logsEmitter } = require("../logs");

function integrateToProtoFns (whiteList, fnName, origin, backup, backupProp, allowList, fullBlock) {

	backup[backupProp] = origin.prototype[fnName];

	origin.prototype[fnName] = function (...args) {

		//NODE-RULES-SYSTEM-SIGNATURE

		if(fullBlock) return returnProxy;

		const callerPaths = getCallerPaths();

		if(!callerPaths) {

			logsEmitter("callProtoFn", [undefined, undefined], {

				grantRights: false,

				protoFn: fnName,
				args,

			});

			debug && console.log("toProtoFn->false", callerPaths);

			return returnProxy;

		}

		const [nativePath, wrapPath] = callerPaths;

		debug && console.log("toProtoFn->true", nativePath, wrapPath);

		if(~allowList.indexOf(nativePath)) {

			return backup[backupProp].apply(this, args);

		}

		for(let i = 0; i < whiteList.length; ++i) {

			if(
				nativePath.startsWith(whiteList[i][0])
				&&
				wrapPath.startsWith(whiteList[i][1])
			) {

				logsEmitter("callProtoFn", [nativePath, wrapPath], {

					grantRights: true,

					protoFn: fnName,
					args,

				});

				return backup[backupProp].apply(this, args);

			}

		}

		logsEmitter("callProtoFn", [nativePath, wrapPath], {

			grantRights: false,

			protoFn: fnName,
			args,

		});

		debug && console.log("toProtoFn->", false);

		return returnProxy;

	};

}

module.exports = integrateToProtoFns;