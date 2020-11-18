const main = require("../whiteListFunctionality");

const connectionsWhiteList = [];
connectionsWhiteList.name = "connections";

module.exports = {

	addCustomPathsToWhiteList(){},
	addPathsToWhiteList(){},
	addDependencyAndPathsToWhiteList(){},
	addDependencyPathAndProjectPathsToWhiteList(){},
};

[

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](connectionsWhiteList, tryPass, args);

	};

});

module.exports.whiteList = connectionsWhiteList;