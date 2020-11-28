const { password, needToSetPassword, wrongPass } = require("../password");
const { wrongPassEmitter } = require("../logs");

const store = require("./extendWrapStore");

const methods = [

	"beforeWrapper",
	"beforeSecureRequire",
	"beforeMainCode",

	"afterMainCode",
	"afterWrapper",

];

for (let i = 0; i < methods.length; ++i) {

	module.exports[methods[i]] = function (tryPass, code) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, methods[i]);

		if(typeof code != "string") return false;

		store[methods[i]].push(code);

		return true;

	}

}

module.exports.getWrapper = function (tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "getWrapper");

	return store.wrapper;

}