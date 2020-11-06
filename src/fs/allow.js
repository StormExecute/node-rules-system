const fs = require("fs");

const { password, needToSetPassword, wrongPass } = require("../password");

const {

	$fs,
	$fsPromises,

	$fsList,
	$fsPromisesList,

} = require("./store");

const restore = require("../restore");

function fsAllowWriteAndChange(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	let fsStatus = false;
	let fsPromisesStatus = false;

	if($fs.status == true) {

		restore($fsList, fs, $fs);

		fsStatus = true;
		$fs.status = false;

	}

	if($fsPromises.status == true) {

		restore($fsPromisesList.concat( [ "open" ] ), fs.promises, $fsPromises);

		fsPromisesStatus = true;
		$fsPromises.status = false;

	}

	return [fsStatus, fsPromisesStatus];

}

module.exports = fsAllowWriteAndChange;