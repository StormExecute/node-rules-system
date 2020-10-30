const main = require("../whiteListFunctionality");

const connectionsWhiteList = [];

module.exports = {

	addFullPathToWhiteList(){},
	addProjectPathToWhiteList(){},
	addDependencyToWhiteList(){},
	addDependencyPathToWhiteList(){},
};

[

	"addFullPathToWhiteList",
	"addProjectPathToWhiteList",
	"addDependencyToWhiteList",
	"addDependencyPathToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](connectionsWhiteList, tryPass, args);

	};

});

module.exports.whiteList = connectionsWhiteList;