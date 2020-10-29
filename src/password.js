const prefix = "[node-rules-system]";

const needToSetPassword = prefix + " To manage rules, you need to set a password!";
const passAlready = prefix + " The password is already set!";

const wrongPass = prefix + " Wrong password!";
const wrongLastPass = prefix + " Wrong last password!";

const mustBeString = prefix + " The password must be a string!";

let password = { value: null };

function setPassword (newPassword) {

	if(typeof newPassword != "string") throw new Error(mustBeString);

	if(password.value === null) {

		password.value = newPassword;

		return true;

	} else {

		throw new Error(passAlready);

	}

}

function changePassword(lastPassword, newPassword) {

	if(typeof lastPassword != "string" || typeof newPassword != "string") throw new Error(mustBeString);

	if(password.value === null) return setPassword(newPassword);

	if(lastPassword == password.value) {

		password.value = newPassword;

		return true;

	} else {

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