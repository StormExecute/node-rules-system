const { StringStartsWith } = require("../_data/primordials");

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

	let l = paths.length ? 1 : 0;

	if ( l && !StringStartsWith( callerPaths[0], paths[0] ) ) {

		return false;

	}

	for (let j = 0; j < callerPaths.length; ++j) {

		const callerPath = callerPaths[j];

		if(blackPaths && blackPaths.length) {

			for (let k = 0; k < blackPaths.length; ++k) {

				if( StringStartsWith( callerPath, blackPaths[k] ) ) {

					return false;

				}

			}

		}

		if(onlyWhited) {

			let ow = false;

			for (let k = 0; k < paths.length; ++k) {

				if ( StringStartsWith( callerPath, paths[k] ) ) {

					ow = true;

					break;

				}

			}

			if(!ow) return false;

		}

		if( (l + 1) <= paths.length ) {

			if (StringStartsWith(callerPath, paths[l])) {

				++l;

			} else if (everyWhite || fullIdentify) {

				return false;

			}

		}

	}

	if(l) {

		return l == paths.length;

	}

	return true;

};