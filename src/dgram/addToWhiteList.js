const main = require("../whiteListFunctionality");

const dgramWhiteList = [];
dgramWhiteList.name = "dgram";

for (let i = 0; i < main.standardWhiteListMethods.length; ++i) {

	module.exports[ main.standardWhiteListMethods[i] ] = function (tryPass, ...args) {

		return main[ main.standardWhiteListMethods[i] ] (dgramWhiteList, tryPass, args);

	};

}

module.exports.whiteList = dgramWhiteList;