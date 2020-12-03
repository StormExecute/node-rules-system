const { prefixS } = require("../_data");
const { password, needToSetPassword, wrongPass } = require("../password");
const { wrongPassEmitter } = require("../logs");
const getCallerPaths = require("../getCallerPaths");

const debug = require("../_debug");
const mRandom = require("../_data/random");

const events = require('events');
const fs = require("fs");

const pathsStore = require("./pathsStore");
const $thisStore = require("./thisStore");

Error.stackTraceLimit = 100;

let maxGetUniqFnNameRecursiveCalls = 15;

function changeMaxGetUniqFnNameRecursiveCalls (tryPass, newValue) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "changeMaxGetUniqFnNameRecursiveCalls", { newValue });

	if(typeof newValue == "number") {

		maxGetUniqFnNameRecursiveCalls = newValue;

		return true;

	}

	return false;

}

function getUniqFnName(prop, recurseI) {

	recurseI = recurseI || 0;

	if(recurseI == maxGetUniqFnNameRecursiveCalls) {

		throw new Error(prefixS + "src/immediateAndTick/integrate:getUniqFnName -> maximum recursion threshold reached.")

	}

	const attemp =  "NRS-" + prop.toUpperCase() + "-FUNCTION-" + mRandom() + mRandom();

	if(!pathsStore[attemp]) return attemp;

	return getUniqFnName(prop, ++recurseI);

}

const integrateIT = {};

[

	[global, "setImmediate"],
	[process, "nextTick"],

	[global, "setTimeout"],
	[global, "setInterval"],

	[global.Promise.prototype, "then"],
	[global.Promise.prototype, "catch"],

	[events.EventEmitter.prototype, "on"],

	[fs, "readFile"],
	[fs, "writeFile"],

].forEach( ( [el, prop] ) => {

	integrateIT[prop] = function (tryPass) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "integrateTimers", { prop });

		if (prop == "setImmediate" && $thisStore.statusImmediate == true) return false;
		if (prop == "nextTick" && $thisStore.statusNextTick == true) return false;

		if (prop == "setTimeout" && $thisStore.statusSetTimeout == true) return false;
		if (prop == "setInterval" && $thisStore.statusSetInterval == true) return false;

		if (prop == "then" && $thisStore.statusPromiseThen == true) return false;
		if (prop == "catch" && $thisStore.statusPromiseCatch == true) return false;

		if (prop == "on" && $thisStore.statusEventEmitterOn == true) return false;

		if (prop == "readFile" && $thisStore.statusFsReadFile == true) return false;
		if (prop == "writeFile" && $thisStore.statusFsWriteFile == true) return false;

		$thisStore[prop] = el[prop];

		el[prop] = function () {

			const callbackI = (function (args) {

				if(prop == "on") return 1;

				if(prop == "readFile" || prop == "writeFile") {

					for (let i = 1; i < args.length; ++i) {

						if(typeof args[i] == "function") {

							return i;

						}

					}

					return null;

				}

				return 0;

			})(arguments);

			if(callbackI === null) return $thisStore[prop].apply(this, arguments);

			const callback = arguments[callbackI];

			const callerPaths = getCallerPaths();

			if(
				!callerPaths.length
				||
				!getCallerPaths.isCallerPath(callerPaths[0])
			) {

				return $thisStore[prop].apply(this, arguments);

			}

			const uniqFunctionName = getUniqFnName(prop);

			pathsStore[uniqFunctionName] = callerPaths;

			const temp = {

				[uniqFunctionName]: function (...args) {

					const result = callback.apply(this, args);

					if(pathsStore[uniqFunctionName]) delete pathsStore[uniqFunctionName];

					return result;

				}

			};

			arguments[callbackI] = temp[uniqFunctionName];

			debug.timers("timers", uniqFunctionName, callerPaths, arguments);

			return $thisStore[prop].apply(this, arguments);

		};

		if (prop == "setImmediate" && $thisStore.statusImmediate == false) return $thisStore.statusImmediate = true;
		if (prop == "nextTick" && $thisStore.statusNextTick == false) return $thisStore.statusNextTick = true;

		if (prop == "setTimeout" && $thisStore.statusSetTimeout == false) return $thisStore.statusSetTimeout = true;
		if (prop == "setInterval" && $thisStore.statusSetInterval == false) return $thisStore.statusSetInterval = true;

		if (prop == "then" && $thisStore.statusPromiseThen == false) return $thisStore.statusPromiseThen = true;
		if (prop == "catch" && $thisStore.statusPromiseCatch == false) return $thisStore.statusPromiseCatch = true;

		if (prop == "on" && $thisStore.statusEventEmitterOn == false) return $thisStore.statusEventEmitterOn = true;

		if (prop == "readFile" && $thisStore.statusFsReadFile == false) return $thisStore.statusFsReadFile = true;
		if (prop == "writeFile" && $thisStore.statusFsWriteFile == false) return $thisStore.statusFsWriteFile = true;

		return false;

	};

});

integrateIT.all = function (tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "integrateTimersAll");

	return [

		integrateIT.setImmediate(tryPass),
		integrateIT.nextTick(tryPass),

		integrateIT.setTimeout(tryPass),
		integrateIT.setInterval(tryPass),

		integrateIT.then(tryPass),
		integrateIT.catch(tryPass),

		integrateIT.on(tryPass),

		integrateIT.readFile(tryPass),
		integrateIT.writeFile(tryPass),

	];

};

module.exports = {

	integrateIT,
	changeMaxGetUniqFnNameRecursiveCalls,

};