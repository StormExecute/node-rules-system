const { password, needToSetPassword, wrongPass } = require("../password");
const { wrongPassEmitter } = require("../logs");
const getCallerPaths = require("../getCallerPaths");

const debug = require("../_debug");

const events = require('events');

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

		throw new Error("[node-rules-system-esm] src/immediateAndTick/integrate:getUniqFnName -> maximum recursion threshold reached.")

	}

	const attemp =  "NRS-" + prop.toUpperCase() + "-FUNCTION-" + Math.random() + Math.random();

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

		$thisStore[prop] = el[prop];

		el[prop] = function () {

			const callbackI = prop == "on" ? 1 : 0;

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

	];

};

module.exports = {

	integrateIT,
	changeMaxGetUniqFnNameRecursiveCalls,

};