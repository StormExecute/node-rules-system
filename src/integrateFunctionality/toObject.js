const getCallerPaths = require("../getCallerPaths");
const getCallerFnName = require("../getCallerFnName");

const returnProxy = require("../returnProxy");

const debug = require("../_debug");

const { logsEmitter } = require("../logs");

function integrateToObject(whiteList, name, origin, backup, allowList, fullBlock) {

	backup[name] = origin[name];

	origin[name] = new Proxy({}, {

		get(target,prop) {

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths.length) {

				logsEmitter("callObj", [], {

					grantRights: false,

					obj: name,
					prop,

				});

				debug.integrate("toObj->false", callerPaths, name);

				return returnProxy;

			}

			debug.integrate("toObj->true", name, prop, callerPaths);

			if(~allowList.indexOf(callerPaths[0])) return backup[name][prop];

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

					logsEmitter("callObj", callerPaths, {

						grantRights: true,

						obj: name,
						prop,

					});

					return backup[name][prop];

				}

			}

			logsEmitter("callObj", callerPaths, {

				grantRights: false,

				obj: name,
				prop,

			});

			debug.integrate("toObj->", false);

			return returnProxy;

		}

	});

}

module.exports = integrateToObject;