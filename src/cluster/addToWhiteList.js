const main = require("../whiteListFunctionality");

const clusterWhiteList = [];
clusterWhiteList.name = "cluster";

for (let i = 0; i < main.standardWhiteListMethods.length; ++i) {

	module.exports[ main.standardWhiteListMethods[i] ] = function (tryPass, ...args) {

		return main[ main.standardWhiteListMethods[i] ] (clusterWhiteList, tryPass, args);

	};

}

module.exports.whiteList = clusterWhiteList;