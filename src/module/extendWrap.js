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

	module.exports[methods[i]] = function (tryPass, id, code) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, methods[i]);

		if(typeof code != "string" || typeof id != "string") return false;

		store[methods[i]].push([id, code]);

		return true;

	}

	module.exports[methods[i] + "Remove"] = function (tryPass, id) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, methods[i] + "Remove");

		if(typeof id != "string") return false;

		let r = false;

		for (let i = 0; i < store[methods[i]].length; ++i) {

			const storeId = store[methods[i]][i][0];

			if(id == storeId) {

				store[methods[i]].splice(i, 1);

				r = true;

				break;

			}

		}

		return r;

	}

}

module.exports.getWrapper = function (tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "getWrapper");

	return store.wrapper;

};

module.exports.allowChangeAndUseTo = function (tryPass, filename) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowChangeAndUseTo");

	if(typeof filename != "string") return false;

	store.whiteFilenamesForWrap.push(filename);

	return true;

};