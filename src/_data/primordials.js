//native modules are not saved in require.cache , so we can put 'primordials' there.
const primordialsStore = require("http");

//if this is the first launch
if(!primordialsStore["NRS_PRIMORDIALS"]) {

	const tempApply = Reflect.apply;
	const tempHasOwnProperty = Object.prototype.hasOwnProperty;

	function cloneFn(fn) {

		const that = fn;

		const temp = function temporary() {

			return !new.target ? tempApply(that, this, arguments) : new that(...arguments)

		};

		for(const key in fn) {

			if( Reflect.apply( tempHasOwnProperty, fn, [key] ) ) {

				temp[key] = fn[key];

			}

		}

		for(const key in fn.prototype) {

			if( Reflect.apply( tempHasOwnProperty, fn.prototype, [key] ) ) {

				temp.prototype[key] = fn.prototype[key];

			}

		}

		return temp;

	}

	const EventEmitter = cloneFn(require("events"));
	const { join, resolve } = require("path");

	Object.freeze(EventEmitter.prototype);
	Object.freeze(EventEmitter);

	Object.defineProperty(primordialsStore, "NRS_PRIMORDIALS", {

		enumerable: true,

		value: Object.freeze({

			execArgv: Object.assign([], process.execArgv),
			processArgv: Object.assign([], process.argv),

			nodePathJoin: join,
			nodePathResolve: resolve,

			EventEmitter,

			Proxy,

			String,
			StringPrototypeMatch: String.prototype.match,
			StringPrototypeReplace: String.prototype.replace,
			StringPrototypeSlice: String.prototype.slice,
			StringPrototypeToUpperCase: String.prototype.toUpperCase,

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


			StringSlice: (string, ...args) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].StringPrototypeSlice,
					string,
					args
				);

			},

			StringToUpperCase: string => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].StringPrototypeToUpperCase,
					string,
					[]
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

			StringStartsWith: (str, arg) => {

				if(!arg || arg.length > str.length) return false;

				for (let i = 0; i < str.length; ++i) {

					if( (i + 1) > arg.length ) break;

					if( str[i] != arg[i] ) return false;

				}

				return true;

			},

			JSONStringify: JSON.stringify,

			ArrayIsArray: Array.isArray,
			ArrayPrototypeForEach: Array.prototype.forEach,
			ArrayPrototypeSlice: Array.prototype.slice,
			ArrayPrototypeSplice: Array.prototype.splice,
			ArrayPrototypeJoin: Array.prototype.join,
			ArrayPrototypeConcat: Array.prototype.concat,

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

			ArrayConcat: (array, ...args) => {

				return primordialsStore["NRS_PRIMORDIALS"].ReflectApply(
					primordialsStore["NRS_PRIMORDIALS"].ArrayPrototypeConcat,
					array,
					args
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
			ClearTimeout: clearTimeout,

		})

	});

}

module.exports = primordialsStore["NRS_PRIMORDIALS"];