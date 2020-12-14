//native modules are not saved in require.cache , so we can put 'primordials' there.
const primordialsStore = require("http");

//if this is the first launch
if(!primordialsStore["NRS_PRIMORDIALS"]) {

	Object.defineProperty(primordialsStore, "NRS_PRIMORDIALS", {

		value: Object.freeze({

			String,
			StringPrototypeMatch: String.prototype.match,
			StringPrototypeReplace: String.prototype.replace,

			StringMatch: (string, matchRegex) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].StringPrototypeMatch,
					string,
					[matchRegex]
				);

			},

			StringReplace: (string, regexp, newSubStr) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].StringPrototypeReplace,
					string,
					[regexp, newSubStr]
				);

			},

			StringIncludes: (string, argument) => {

				//argument is 100% string > 0

				let matchI = 0;

				for (let i = 0; i < string.length; ++i) {

					if(string[i] == argument[matchI]) {

						++matchI;

						if(matchI == argument.length) return true;

					} else {

						matchI = 0;

					}

				}

				return false;

			},

			JSONStringify: JSON.stringify,

			ArrayIsArray: Array.isArray,
			ArrayPrototypeForEach: Array.prototype.forEach,
			ArrayPrototypeSlice: Array.prototype.slice,
			ArrayPrototypeSplice: Array.prototype.splice,
			ArrayPrototypeJoin: Array.prototype.join,

			ArrayForEach: (array, callbackFn) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].ArrayPrototypeForEach,
					array,
					[callbackFn]
				);

			},

			ArraySlice: (array, ...args) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].ArrayPrototypeSlice,
					array,
					args
				);

			},

			ArraySplice: (array, ...args) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].ArrayPrototypeSplice,
					array,
					args
				);

			},

			ArrayJoin: (array, separator) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].ArrayPrototypeJoin,
					array,
					[separator]
				);

			},

			ArrayIndexOf: (array, searchElement) => {

				//fromIndex not needed

				for (let i = 0; i < array.length; ++i) {

					if( array[i] === searchElement ) {

						return i;

					}

				}

				return -1;

			},

			/*ArrayPush: (array, newElement) => {

				array[array.length] = newElement;

				return array.length;

			},*/

			ObjectDefineProperty: Object.defineProperty,
			ObjectFreeze: Object.freeze,
			ObjectAssign: Object.assign,
			ObjectPrototypeToString: Object.prototype.toString,

			ReflectApply: Reflect.apply,
			MathRandom: Math.random,
			SetTimeout: setTimeout,

		})

	});

}

module.exports = primordialsStore["NRS_PRIMORDIALS"];