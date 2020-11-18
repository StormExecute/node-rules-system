const main = require("../whiteListFunctionality");

const dgramWhiteList = [];
dgramWhiteList.name = "dgram";

[

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](dgramWhiteList, tryPass, args);

	};

});

module.exports.whiteList = dgramWhiteList;