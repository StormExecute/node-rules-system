const { password, needToSetPassword, wrongPass } = require("../password");

const { whiteList } = require("./addToWhiteList");

const dgram = require("dgram");

const $drgam = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");

function blockDgram(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($drgam.status == true) return false;

	integrateToFns(
		whiteList,
		["_createSocketHandle", "createSocket", "Socket"],
		dgram,
		$drgam,
		["internal/child_process.js"],
		fullBlock
	);

	return $drgam.status = true;

}

module.exports = blockDgram;