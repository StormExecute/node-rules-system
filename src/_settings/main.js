const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const storeSettings = require("./store");

module.exports = {

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

};