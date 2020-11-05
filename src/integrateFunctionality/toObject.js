const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = require("./debugThisFn");

const { logsEmitter } = require("../logs");

function integrateToObject(whiteList, name, origin, backup, allowList, fullBlock) {

	backup[name] = origin[name];

	origin[name] = new Proxy({}, {

		get(target,prop) {

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths) {

				logsEmitter("callObj", [undefined, undefined], {

					grantRights: false,

					obj: name,
					prop,

				});

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

					logsEmitter("callObj", [nativePath, wrapPath], {

						grantRights: true,

						obj: name,
						prop,

					});

					return backup[name][prop];

				}

			}

			logsEmitter("callObj", [nativePath, wrapPath], {

				grantRights: false,

				obj: name,
				prop,

			});

			debug && console.log("toObj->", false);

			return returnProxy;

		}

	});

}

module.exports = integrateToObject;