const prefix = "[node-rules-system]";

const needToSetPassword = prefix + " To manage rules, you need to set a password!";
const passAlready = prefix + " The password is already set!";

const wrongPass = prefix + " Wrong password!";
const wrongLastPass = prefix + " Wrong last password!";

const mustBeString = prefix + " The password must be a string!";

const password = { value: null };

const { logsEmitter } = require("./logs");

function setPassword (newPassword) {

	if(typeof newPassword != "string") throw new Error(mustBeString);

	if(password.value === null) {

		password.value = newPassword;

		logsEmitter.force("setPassword");

		return true;

	} else {

		logsEmitter("passwordAlready");

		throw new Error(passAlready);

	}

}

function changePassword(lastPassword, newPassword) {

	if(typeof lastPassword != "string" || typeof newPassword != "string") throw new Error(mustBeString);

	if(password.value === null) return setPassword(newPassword);

	if(lastPassword == password.value) {

		password.value = newPassword;

		logsEmitter("changePassword");

		return true;

	} else {

		logsEmitter("wrongChangePassword", null, { wrongLastPass: lastPassword });

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