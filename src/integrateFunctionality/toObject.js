const { password } = require("../password");

const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = require("./debugThisFn");

function integrateToObject(whiteList, name, origin, backup, allowList, fullBlock) {

	backup[name] = origin[name];

	origin[name] = new Proxy({}, {

		get(target,prop) {

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths) {

				debug && console.log("toObj->false", callerPaths, name);

				return returnProxy;

			}

			const [nativePath, wrapPath] = callerPaths;

			debug && console.log("toObj->true", name, prop, nativePath, wrapPath);

			if(~allowList.indexOf(nativePath)) return backup[name][prop];

			for(let i = 0; i < whiteList.length; ++i) {

				if(
					nativePath.startsWith(whiteList[i][0])
					&&
					wrapPath.startsWith(whiteList[i][1])
				) {

					return backup[name][prop];

				}

			}

			debug && console.log("toObj->", false);

			return returnProxy;

		}

	});

}

module.exports = integrateToObject;