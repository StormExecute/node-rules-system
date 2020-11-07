const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const dgram = require("dgram");

const $drgam = require("./store");

const restore = require("../restore");

function allowDgram(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowDgram");

	if($drgam.status == false) return false;

	restore(
		["_createSocketHandle", "createSocket", "Socket"],
		dgram,
		$drgam
	);

	$drgam.status = false;

	return true;

}

module.exports = allowDgram;