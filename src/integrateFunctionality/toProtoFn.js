const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = require("./debugThisFn");

function integrateToProtoFns (whiteList, fnName, origin, backup, backupProp, allowList) {

	backup[backupProp] = origin[fnName];

	origin.prototype[fnName] = function (...args) {

		const callerPaths = getCallerPaths();

		if(!callerPaths) {

			debug && console.log("toProtoFn->false", callerPaths);

			return returnProxy;

		}

		const [callerFile, dependencyPath] = callerPaths;

		debug && console.log("toProtoFn->true", callerFile, dependencyPath);

		if(~allowList.indexOf(callerFile)) {

			return backup[backupProp].apply(this, args);

		}

		for(let i = 0; i < whiteList.length; ++i) {

			if(
				callerFile.startsWith(whiteList[i][0])
				&&
				dependencyPath.startsWith(whiteList[i][1])
			) {

				return backup[backupProp].apply(this, args);

			}

		}

		return returnProxy;

	};

}

module.exports = integrateToProtoFns;