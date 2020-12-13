const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const storeSettings = require("./store");

const { randomSignChanger } = require("../module/wrap");

const { $corePath } = require("../whiteListFunctionality");

module.exports = {

	setChangeModuleRandomSignInterval(tryPass, ms, immediately) {

		if (password.value === null) throw new Error(needToSetPassword);
		if (tryPass != password.value) return wrongPassEmitter(wrongPass, "setChangeModuleRandomSignInterval", { ms, immediately });

		if(typeof ms != "number") return false;

		storeSettings.changeModuleRandomSignInterval = ms;

		return randomSignChanger(!!immediately);

	},

	throwIfWrongPassword(tryPass) {

		if (password.value === null) throw new Error(needToSetPassword);
		if (tryPass != password.value) return wrongPassEmitter(wrongPass, "throwIfWrongPassword");

		storeSettings.throwIfWrongPassword = true;

		return true;

	},

	dontThrowIfWrongPassword(tryPass) {

		if (password.value === null) throw new Error(needToSetPassword);
		if (tryPass != password.value) return wrongPassEmitter(wrongPass, "dontThrowIfWrongPassword");

		storeSettings.throwIfWrongPassword = false;

		return true;

	},

	setCorePath(tryPass, path) {

		if (password.value === null) throw new Error(needToSetPassword);
		if (tryPass != password.value) return wrongPassEmitter(wrongPass, "setCorePath", { path });

		if(typeof path != "string") return false;

		$corePath.value = path;

		return true;

	},

	$getCorePath() {

		return $corePath.value;

	},

};