const { password, needToSetPassword, wrongPass } = require("./password");

const { logsEmitter, wrongPassEmitter } = require("./logs");

//NRS.connections.$http.get(pass, propName)
//NRS.fs.$fs.get(pass, propName)

function make(object) {

	return function (tryPass, propName) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) wrongPassEmitter(wrongPass, "get", { propName });

		logsEmitter("get", null, {

			grantRights: true,

			propName,

		});

		return object[propName];

	}

}

module.exports = make;