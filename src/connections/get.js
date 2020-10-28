const { password, needToSetPassword, wrongPass } = require("../password");

//NRS.connections.$http.get(propName)

function make(object) {

	return function (tryPass, propName) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) throw new Error(wrongPass);

		return object[propName];

	}

}

module.exports = make;