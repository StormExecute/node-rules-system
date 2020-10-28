const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = require("./debugThisFn");

function integrateToProtoFns (whiteList, fnName, origin, backup, backupProp, allowList) {

	backup[backupProp] = origin.prototype[fnName];

	origin.prototype[fnName] = function (...args) {

		const callerPaths = getCallerPaths();

		if(!callerPaths) {

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

				return backup[backupProp].apply(this, args);

			}

		}

		debug && console.log("toProtoFn->", false);

		return returnProxy;

	};

}

module.exports = integrateToProtoFns;