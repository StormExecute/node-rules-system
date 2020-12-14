const { password, needToSetPassword, wrongPass } = require("../password");

const { ArrayIsArray } = require("../_data/primordials");

const { wrongPassEmitter } = require("../logs");

const $Module = require("./store");

const { patchWrap } = require("./wrap");

const setSecureRequireToModule = require("./setSecureRequirePatch");

function secureRequirePatch(tryPass, whiteFilenames, ) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "useSecureRequirePatch");

	if($Module.statusSecureRequire == true) return false;
	if(!$Module.statusPatchWrap) patchWrap();

	const whiteFilenamesParsed = typeof whiteFilenames == "string" ? [whiteFilenames] : [];

	if(!whiteFilenamesParsed.length && ArrayIsArray(whiteFilenames)) {

		for (let i = 0; i < whiteFilenames.length; ++i) {

			if(typeof whiteFilenames[i] == "string") {

				whiteFilenamesParsed[ whiteFilenamesParsed.length ] = whiteFilenames[i];

			}

		}

	}

	setSecureRequireToModule(whiteFilenamesParsed);

	return $Module.statusSecureRequire = true;

}

module.exports = secureRequirePatch;