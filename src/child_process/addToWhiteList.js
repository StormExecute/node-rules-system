const main = require("../whiteListFunctionality");

const childProcessWhiteList = [];
childProcessWhiteList.name = "child_process";

for (let i = 0; i < main.standardWhiteListMethods.length; ++i) {

	module.exports[ main.standardWhiteListMethods[i] ] = function (tryPass, ...args) {

		return main[ main.standardWhiteListMethods[i] ] (childProcessWhiteList, tryPass, args);

	};

}

module.exports.whiteList = childProcessWhiteList;