const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const $process = require("./storeBindings");

const restore = require("../restore");

function allowBinding(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowProcessBinding");

	if($process.statusBinding == false) return false;

	restore(["binding"], process, $process);

	$process.statusBinding = false;

	return true;

}

function allowLinkedBinding(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowProcessLinkedBinding");

	if($process.statusLinkedBinding == false) return false;

	restore(["_linkedBinding"], process, $process);

	$process.statusLinkedBinding = false;

	return true;

}

function allowDlopen(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowProcessDlopen");

	if($process.statusDlopen == false) return false;

	restore(["dlopen"], process, $process);

	$process.statusDlopen = false;

	return true;

}

function allowAll(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowProcessBindingLinkedBindingAndDlopen");

	return [

		allowBinding(tryPass),
		allowLinkedBinding(tryPass),
		allowDlopen(tryPass),

	];

}

module.exports = {

	allowBinding,
	allowLinkedBinding,
	allowDlopen,

	allowAll,

};