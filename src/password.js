const needToSetPassword = "[node-rules-system] To manage rules, you need to set a password!";
const wrongPass = "[node-rules-system] Wrong password!"

let password = { value: null };

function setPassword (newPassword) {

	if(password.value === null) {

		password.value = newPassword;

		return true;

	} else {

		return false;

	}

}

function changePassword(lastPassword, newPassword) {

	if(typeof lastPassword != "string" || typeof newPassword != "string") return false;

	if(password.value === null) return setPassword(newPassword);

	if(lastPassword == password) {

		password.value = newPassword;

		return true;

	} else {

		return false;

	}

}

module.exports = {

	password,

	needToSetPassword,
	wrongPass,

	setPassword,
	changePassword,

};