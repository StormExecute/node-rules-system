const main = require("../whiteListFunctionality");

const fsWhiteList = [];

[

	"addFullPathToWhiteList",
	"addProjectPathToWhiteList",
	"addDependencyToWhiteList",
	"addDependencyPathToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](fsWhiteList, tryPass, args);

	};

});

module.exports.whiteList = fsWhiteList;