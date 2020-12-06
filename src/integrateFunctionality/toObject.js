const checkAccess = require("./checkAccess");

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

				const {

					customHandler,

				} = whiteList[i];

				let access = false;

				if(typeof customHandler == "function") {

					access = !!customHandler("callObj", {

						callerPaths,
						callerFnName: getCallerFnName(),

						args: arguments,

						origin,

						objName: name,
						objProp: prop,

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