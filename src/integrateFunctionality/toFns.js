const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const debug = require("./debugThisFn");

function integrateToFns(whiteList, fnArray, origin, backup, allowList, fullBlock) {

	allowList = allowList || [];

	fnArray.forEach(el => {

		backup[el] = origin[el];

		origin[el] = function (...args) {

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths) {

				debug && console.log("toFns->false", callerPaths, el);

				return returnProxy;

			}

			const [nativePath, wrapPath] = callerPaths;

			debug && console.log("toFns->true", el, nativePath, wrapPath);

			if(~allowList.indexOf(nativePath)) {

				return new.target ? new backup[el](...args) : backup[el].apply(this, args);

			}

			for(let i = 0; i < whiteList.length; ++i) {

				if(
					nativePath.startsWith(whiteList[i][0])
					&&
					wrapPath.startsWith(whiteList[i][1])
				) {

					return new.target ? new backup[el](...args): backup[el].apply(this, args);

				}

			}

			debug && console.log("toFns->", false);

			return returnProxy;

		};

	});

}

module.exports = integrateToFns;