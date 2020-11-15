const { password, needToSetPassword, wrongPass } = require("../password");
const { wrongPassEmitter } = require("../logs");

const $thisStore = require("./thisStore");

const restore = require("../restore");

const thisRestoreFunctionality = {

	setImmediate(tryPass){},
	nextTick(tryPass){},

};

[

	[global, "setImmediate"],
	[process, "nextTick"],

].forEach( ( [el, prop] ) => {

	thisRestoreFunctionality[prop] = function (tryPass) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "restoreTimers", { prop });

		if (prop == "setImmediate" && $thisStore.statusImmediate == false) return false;
		if (prop == "nextTick" && $thisStore.statusNextTick == false) return false;

		restore([prop], el, $thisStore);

		if (prop == "setImmediate" && $thisStore.statusImmediate == true) $thisStore.statusImmediate = false;
		if (prop == "nextTick" && $thisStore.statusNextTick == true) $thisStore.statusNextTick = false;

		return true;

	};

});

thisRestoreFunctionality.all = function (tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "restoreTimersAll");

	return [

		thisRestoreFunctionality.setImmediate(tryPass),
		thisRestoreFunctionality.nextTick(tryPass),

	];

};

module.exports = thisRestoreFunctionality;