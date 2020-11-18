const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = require("./debugThisFn");

const { logsEmitter } = require("../logs");

function integrateToFns(whiteList, fnArray, origin, backup, allowList, fullBlock) {

	allowList = allowList || [];

	fnArray.forEach(el => {

		backup[el] = origin[el];

		origin[el] = function (...args) {

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths.length) {

				logsEmitter("callFn", [], {

					grantRights: false,

					fn: el,
					args,

					calledAsClass: !!(new.target),

				});

				debug && console.log("toFns->false", callerPaths, el);

				return returnProxy;

			}

			debug && console.log("toFns->true", el, callerPaths);

			if(~allowList.indexOf(callerPaths[0])) {

				//dont emit

				return new.target ? new backup[el](...args) : backup[el].apply(this, args);

			}

			for(let i = 0; i < whiteList.length; ++i) {

				const { callerFnName, paths } = whiteList[i];

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
						args,

						calledAsClass: !!(new.target),

					});

					return new.target ? new backup[el](...args): backup[el].apply(this, args);

				}

			}

			logsEmitter("callFn", callerPaths, {

				grantRights: false,

				fn: el,
				args,

				calledAsClass: !!(new.target),

			});

			debug && console.log("toFns->", false);

			return returnProxy;

		};

	});

}

module.exports = integrateToFns;