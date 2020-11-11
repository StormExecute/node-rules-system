const fs = require("fs");

const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const {

	$fs,
	$fsPromises,

	$fsList,
	$fsPromisesList,

} = require("./store");

const restore = require("../restore");

const needProcessVersion = require("../../dependencies/needProcessVersion");
const fsPromisesSupport = ~needProcessVersion("10.0.0");

function fsAllowWriteAndChange(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowFs");

	let fsStatus = false;
	let fsPromisesStatus = false;

	if($fs.status == true) {

		restore($fsList, fs, $fs);

		fsStatus = true;
		$fs.status = false;

	}

	if(fsPromisesSupport && $fsPromises.status == true) {

		restore($fsPromisesList.concat( [ "open" ] ), fs.promises, $fsPromises);

		fsPromisesStatus = true;
		$fsPromises.status = false;

	} else if(!fsPromisesSupport) {

		fsPromisesStatus = null;

	}

	return [fsStatus, fsPromisesStatus];

}

module.exports = fsAllowWriteAndChange;