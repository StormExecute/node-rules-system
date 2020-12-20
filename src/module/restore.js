const { password, needToSetPassword, wrongPass } = require("../password");

const settings = require("../_settings/store");

const { wrongPassEmitter } = require("../logs");

const Module = require("module");
const $Module = require("./store");

const restore = require("../restore");

const wrapStore = require("./wrapStore");
const { randomSignChanger } = require("./wrap");

function offSecureRequirePatch(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "offSecureRequirePatch");

	if($Module.statusSecureRequire == false) return [false, $Module.statusPatchWrap];

	$Module.secureRequire = null;
	$Module.secureRequireArgsLink = null;

	if(!$Module.statusDependencyController) {

		restore(["wrap"], Module, $Module);

		delete global[wrapStore.utils];

		if(settings.changeModuleRandomSignInterval && randomSignChanger.timeout) {

			clearTimeout(randomSignChanger.timeout);

		}

		$Module.statusPatchWrap = false;

	}

	$Module.statusSecureRequire = false;

	return [true, $Module.statusPatchWrap];

}

function offDependencyController(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "offDependencyController");

	if($Module.statusDependencyController == false) return [false, $Module.statusPatchWrap];

	delete global[wrapStore.dRules];

	$Module.dependencyController = null;

	if(!$Module.statusSecureRequire) {

		restore(["wrap"], Module, $Module);

		delete global[wrapStore.utils];

		if(settings.changeModuleRandomSignInterval && randomSignChanger.timeout) {

			clearTimeout(randomSignChanger.timeout);

		}

		$Module.statusPatchWrap = false;

	}

	$Module.statusDependencyController = false;

	return [true, $Module.statusPatchWrap];

}

function restoreOriginalRequire(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "restoreOriginalRequire");

	//secureRequire, dependencyController, moduleWrap
	const result = [false, false, false];

	if($Module.statusSecureRequire == true) {

		$Module.secureRequire = null;
		$Module.secureRequireArgsLink = null;

		$Module.statusSecureRequire = false;

		result[0] = true;

	}

	if($Module.statusDependencyController == true) {

		delete global[wrapStore.dRules];
		$Module.dependencyController = null;

		$Module.statusDependencyController = false;

		result[1] = true;

	}

	if($Module.statusPatchWrap == true) {

		restore(["wrap"], Module, $Module);

		delete global[wrapStore.utils];

		if(settings.changeModuleRandomSignInterval && randomSignChanger.timeout) {

			clearTimeout(randomSignChanger.timeout);

		}

		$Module.statusPatchWrap = false;

		result[2] = true;

	}

	return result;

}

module.exports = {

	offSecureRequirePatch,
	offDependencyController,

	restoreOriginalRequire,

};