const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = false;

function integrateToObject(name, origin, backup, allowList) {

	backup[name] = origin[name];

	origin[name] = new Proxy({}, {

		get(target,prop) {

			const callerPaths = getCallerPaths();

			debug && console.log(0.8, callerPaths, name);

			if(!callerPaths) return returnProxy;

			const [callerFile, dependencyPath] = callerPaths;

			debug && console.log(2, name, callerFile, dependencyPath);

			if(~allowList.indexOf(callerFile)) return backup[name][prop];

			for(let i = 0; i < whiteList.length; ++i) {

				if(
					callerFile.startsWith(whiteList[i][0])
					&&
					dependencyPath.startsWith(whiteList[i][1])
				) {

					return backup[name][prop];

				}

			}

			return returnProxy;

		}

	});

}

module.exports = integrateToObject;