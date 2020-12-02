const main = require("../whiteListFunctionality");

const connectionsWhiteList = [];
connectionsWhiteList.name = "connections";

for (let i = 0; i < main.standardWhiteListMethods.length; ++i) {

	module.exports[ main.standardWhiteListMethods[i] ] = function (tryPass, ...args) {

		return main[ main.standardWhiteListMethods[i] ] (connectionsWhiteList, tryPass, args);

	};

}

module.exports.whiteList = connectionsWhiteList;