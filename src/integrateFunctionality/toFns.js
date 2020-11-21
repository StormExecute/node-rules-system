const getCallerPaths = require("../getCallerPaths");
const getCallerFnName = require("../getCallerFnName");

const returnProxy = require("../returnProxy");

const debug = require("../_debug");

const { logsEmitter } = require("../logs");

function integrateToFns(whiteList, fnArray, origin, backup, allowList, fullBlock) {

	allowList = allowList || [];

	fnArray.forEach(el => {

		backup[el] = origin[el];

		origin[el] = function () {

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths.length) {

				logsEmitter("callFn", [], {

					grantRights: false,

					fn: el,
					args: arguments,

					calledAsClass: !!(new.target),

				});

				debug.integrate("toFns->false", callerPaths, el);

				return returnProxy;

			}

			debug.integrate("toFns->true", el, callerPaths);

			if(~allowList.indexOf(callerPaths[0])) {

				//dont emit

				return new.target ? new backup[el](...arguments) : backup[el].apply(this, arguments);

			}

			for(let i = 0; i < whiteList.length; ++i) {

				const { callerFnName, paths } = whiteList[i];

				if(typeof callerFnName == "string") {

					if(getCallerFnName() != callerFnName) continue;

				}

				let l = 0;

				for(let j = 0; j < callerPaths.length; ++j) {

					if((l + 1) > paths.length) break;

					const callerPath = callerPaths[j];

					if( callerPath.startsWith( paths[l] ) ) {

						++l;

					}

				}

				if(l && l == paths.length) {

					logsEmitter("callFn", callerPaths, {

						grantRights: true,

						fn: el,
						args: arguments,

						calledAsClass: !!(new.target),

					});

					return new.target ? new backup[el](...arguments): backup[el].apply(this, arguments);

				}

			}

			logsEmitter("callFn", callerPaths, {

				grantRights: false,

				fn: el,
				args: arguments,

				calledAsClass: !!(new.target),

			});

			debug.integrate("toFns->", false);

			return returnProxy;

		};

	});

}

module.exports = integrateToFns;