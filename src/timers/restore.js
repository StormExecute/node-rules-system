const { password, needToSetPassword, wrongPass } = require("../password");

const { ArrayForEach } = require("../_data/primordials");

const { wrongPassEmitter } = require("../logs");

const events = require("events");
const fs = require("fs");

const $thisStore = require("./thisStore");

const restore = require("../restore");

const thisRestoreFunctionality = {

	setImmediate(tryPass){},
	nextTick(tryPass){},

	setTimeout(tryPass){},
	setInterval(tryPass){},

	then(tryPass){},
	catch(tryPass){},

	on(tryPass){},

	readFile(tryPass){},
	writeFile(tryPass){},

};

ArrayForEach([

	[global, "setImmediate"],
	[process, "nextTick"],

	[global, "setTimeout"],
	[global, "setInterval"],

	[global.Promise.prototype, "then"],
	[global.Promise.prototype, "catch"],

	[events.EventEmitter.prototype, "on"],

	[fs, "readFile"],
	[fs, "writeFile"],

], ( [el, prop] ) => {

	thisRestoreFunctionality[prop] = function (tryPass) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "restoreTimers", { prop });

		if (prop == "setImmediate" && $thisStore.statusImmediate == false) return false;
		if (prop == "nextTick" && $thisStore.statusNextTick == false) return false;

		if (prop == "setTimeout" && $thisStore.statusSetTimeout == false) return false;
		if (prop == "setInterval" && $thisStore.statusSetInterval == false) return false;

		if (prop == "then" && $thisStore.statusPromiseThen == false) return false;
		if (prop == "catch" && $thisStore.statusPromiseCatch == false) return false;

		if (prop == "on" && $thisStore.statusEventEmitterOn == false) return false;

		if (prop == "readFile" && $thisStore.statusFsReadFile == false) return false;
		if (prop == "writeFile" && $thisStore.statusFsWriteFile == false) return false;

		restore([prop], el, $thisStore);

		if (prop == "setImmediate" && $thisStore.statusImmediate == true) $thisStore.statusImmediate = false;
		if (prop == "nextTick" && $thisStore.statusNextTick == true) $thisStore.statusNextTick = false;

		if (prop == "setTimeout" && $thisStore.statusSetTimeout == true) $thisStore.statusSetTimeout = false;
		if (prop == "setInterval" && $thisStore.statusSetInterval == true) $thisStore.statusSetInterval = false;

		if (prop == "then" && $thisStore.statusPromiseThen == true) $thisStore.statusPromiseThen = false;
		if (prop == "catch" && $thisStore.statusPromiseCatch == true) $thisStore.statusPromiseCatch = false;

		if (prop == "on" && $thisStore.statusEventEmitterOn == true) $thisStore.statusEventEmitterOn = false;

		if (prop == "readFile" && $thisStore.statusFsReadFile == true) $thisStore.statusFsReadFile = false;
		if (prop == "writeFile" && $thisStore.statusFsWriteFile == true) $thisStore.statusFsWriteFile = false;

		return true;

	};

});

thisRestoreFunctionality.all = function (tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "restoreTimersAll");

	return [

		thisRestoreFunctionality.setImmediate(tryPass),
		thisRestoreFunctionality.nextTick(tryPass),

		thisRestoreFunctionality.setTimeout(tryPass),
		thisRestoreFunctionality.setInterval(tryPass),

		thisRestoreFunctionality.then(tryPass),
		thisRestoreFunctionality.catch(tryPass),

		thisRestoreFunctionality.on(tryPass),

		thisRestoreFunctionality.readFile(tryPass),
		thisRestoreFunctionality.writeFile(tryPass),

	];

};

module.exports = thisRestoreFunctionality;