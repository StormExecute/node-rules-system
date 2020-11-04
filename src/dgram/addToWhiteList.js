const main = require("../whiteListFunctionality");

const dgramWhiteList = [];

[

	"addFullPathToWhiteList",
	"addProjectPathToWhiteList",
	"addDependencyToWhiteList",
	"addDependencyPathToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](dgramWhiteList, tryPass, args);

	};

});

module.exports.whiteList = dgramWhiteList;