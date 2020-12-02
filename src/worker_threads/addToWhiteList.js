const main = require("../whiteListFunctionality");

const workerThreadsWhiteList = [];
workerThreadsWhiteList.name = "worker_threads";

for (let i = 0; i < main.standardWhiteListMethods.length; ++i) {

	module.exports[ main.standardWhiteListMethods[i] ] = function (tryPass, ...args) {

		return main[ main.standardWhiteListMethods[i] ] (workerThreadsWhiteList, tryPass, args);

	};

}

module.exports.whiteList = workerThreadsWhiteList;