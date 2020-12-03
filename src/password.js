const { prefixS } = require("./_data");

const needToSetPassword = prefixS + "To manage rules, you need to set a password!";
const passAlready = prefixS + "The password is already set!";

const wrongPass = prefixS + "Wrong password!";
const wrongLastPass = prefixS + "Wrong last password!";

const mustBeString = prefixS + "The password must be a string!";

const password = { value: null };

const { logsEmitter } = require("./logs");

function setPassword (newPassword) {

	if(typeof newPassword != "string") throw new Error(mustBeString);

	if(password.value === null) {

		password.value = newPassword;

		logsEmitter.force("setPassword", null, { where: "init" });

		return true;

	} else {

		logsEmitter.force("passwordAlready");

		throw new Error(passAlready);

	}

}

function changePassword(lastPassword, newPassword) {

	if(typeof lastPassword != "string" || typeof newPassword != "string") throw new Error(mustBeString);

	if(password.value === null) return setPassword(newPassword);

	if(lastPassword == password.value) {

		password.value = newPassword;

		logsEmitter.force("changePassword");

		return true;

	} else {

		logsEmitter.force("wrongChangePassword", null, { wrongLastPass: lastPassword });

		throw new Error(wrongLastPass);

	}

}

module.exports = {

	password,

	needToSetPassword,
	passAlready,

	wrongPass,
	wrongLastPass,

	mustBeString,

	setPassword,
	changePassword,

};