const { password, needToSetPassword, wrongPass } = require("../password");

const $process = require("./storeBindings");

const restore = require("../restore");

function allowBinding(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($process.statusBinding == false) return false;

	restore(["binding"], process, $process);

	$process.statusBinding = false;

	return true;

}

function allowLinkedBinding(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($process.statusLinkedBinding == false) return false;

	restore(["_linkedBinding"], process, $process);

	$process.statusLinkedBinding = false;

	return true;

}

function allowDlopen(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($process.statusDlopen == false) return false;

	restore(["dlopen"], process, $process);

	$process.statusDlopen = false;

	return true;

}

function allowAll(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

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