const { password, needToSetPassword, wrongPass } = require("../password");
const { wrongPassEmitter } = require("../logs");
const getCallerPaths = require("../getCallerPaths");

const pathsStore = require("./pathsStore");
const $thisStore = require("./thisStore");

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

].forEach( ( [el, prop] ) => {

	integrateIT[prop] = function (tryPass) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "integrateTimers", { prop });

		if (prop == "setImmediate" && $thisStore.statusImmediate == true) return false;
		if (prop == "nextTick" && $thisStore.statusNextTick == true) return false;

		$thisStore[prop] = el[prop];

		el[prop] = function () {

			const callback = arguments[0];

			const uniqFunctionName = getUniqFnName(prop);

			pathsStore[uniqFunctionName] = getCallerPaths();

			const temp = {

				[uniqFunctionName]: function (...args) {

					return callback.apply(this, args);

				}

			};

			arguments[0] = temp[uniqFunctionName];

			return $thisStore[prop].apply(this, arguments);

		};

		if (prop == "setImmediate" && $thisStore.statusImmediate == false) return $thisStore.statusImmediate = true;
		if (prop == "nextTick" && $thisStore.statusNextTick == false) return $thisStore.statusNextTick = true;

		return false;

	};

});

integrateIT.all = function (tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "integrateTimersAll");

	return [

		integrateIT.setImmediate(tryPass),
		integrateIT.nextTick(tryPass),

	];

};

module.exports = {

	integrateIT,
	changeMaxGetUniqFnNameRecursiveCalls,

};