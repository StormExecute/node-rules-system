const main = require("../whiteListFunctionality");

const fsWhiteList = [];
fsWhiteList.name = "fs";

for (let i = 0; i < main.standardWhiteListMethods.length; ++i) {

	module.exports[ main.standardWhiteListMethods[i] ] = function (tryPass, ...args) {

		return main[ main.standardWhiteListMethods[i] ] (fsWhiteList, tryPass, args);

	};

}

module.exports.whiteList = fsWhiteList;