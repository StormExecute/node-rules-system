const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const Module = require('module');

const $Module = require("./store");

const restore = require("../restore");

function restoreOriginalRequire(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "restoreOriginalRequire");

	if($Module.status == false) return false;

	delete global[$Module.secureRequireSecretEmitter];

	restore(["wrap", "secureRequireSecretEmitter"], Module, $Module);

	$Module.status = false;

	return true;

}

module.exports = restoreOriginalRequire;