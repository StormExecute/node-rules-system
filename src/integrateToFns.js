const getCallerPaths = require("./getCallerPaths");

const returnProxy = require("./returnProxy");

const debug = false;

function integrateToFns(whiteList, fnArray, origin, backup, allowList) {

	allowList = allowList || [];

	fnArray.forEach(el => {

		backup[el] = origin[el];

		origin[el] = function (...args) {

			const callerPaths = getCallerPaths();

			debug && console.log(0, callerPaths, el);

			if(!callerPaths) return returnProxy;

			const [callerFile, dependencyPath] = callerPaths;

			debug && console.log(1, el, callerFile, dependencyPath);

			if(~allowList.indexOf(callerFile)) {

				return new.target ? new backup[el](...args) : backup[el].apply(this, args);

			}

			for(let i = 0; i < whiteList.length; ++i) {

				if(
					callerFile.startsWith(whiteList[i][0])
					&&
					dependencyPath.startsWith(whiteList[i][1])
				) {

					return new.target ? new backup[el](...args): backup[el].apply(this, args);

				}

			}

			return returnProxy;

		};

	});

}