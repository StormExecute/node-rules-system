const main = require("../whiteListFunctionality");

const childProcessWhiteList = [];

[

	"addFullPathToWhiteList",
	"addProjectPathToWhiteList",
	"addDependencyToWhiteList",
	"addDependencyPathToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](childProcessWhiteList, tryPass, args);

	};

});

module.exports.whiteList = childProcessWhiteList;