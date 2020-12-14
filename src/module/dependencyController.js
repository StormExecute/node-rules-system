const { password, needToSetPassword, wrongPass } = require("../password");
const { wrongPassEmitter } = require("../logs");

const isObject = require("../../dependencies/isObject");

const $Module = require("./store");

const { setGlobalDrules, patchWrap } = require("./wrap");

const setDependencyController = require("./setDependencyController");

function dependencyController(tryPass, argsObject) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "useDependencyController");

	if(!isObject(argsObject)) return false;

	if($Module.statusDependencyController == true) return false;
	if(!$Module.statusPatchWrap) patchWrap();

	setGlobalDrules(argsObject);
	setDependencyController();

	return $Module.statusDependencyController = true;

}

module.exports = dependencyController;