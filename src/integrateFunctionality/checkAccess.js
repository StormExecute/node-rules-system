const getCallerFnName = require("../getCallerFnName");

module.exports = function ({

   callerPaths,

   paths,
   blackPaths,

   callerFnName,
   onlyWhited,
   everyWhite,
   fullIdentify,

}) {

	if(fullIdentify && paths.length != callerPaths.length) return false;

	if (typeof callerFnName == "string") {

		if (getCallerFnName() != callerFnName) return false;

	}

	if (!callerPaths[0].startsWith(paths[0])) {

		return false;

	}

	let l = 1;

	for (let j = 0; j < callerPaths.length; ++j) {

		if ((l + 1) > paths.length) break;

		const callerPath = callerPaths[j];

		if(blackPaths && blackPaths.length) {

			for (let k = 0; k < blackPaths.length; ++k) {

				if(callerPath.startsWith(blackPaths[k])) {

					return false;

				}

			}

		}

		if(onlyWhited) {

			let ow = false;

			for (let k = 0; k < paths.length; ++k) {

				if (callerPath.startsWith(paths[k])) {

					ow = true;

					break;

				}

			}

			if(!ow) return false;

		}

		if (callerPath.startsWith(paths[l])) {

			++l;

		} else if(everyWhite || fullIdentify) {

			return false;

		}

	}

	return l && l == paths.length;

};