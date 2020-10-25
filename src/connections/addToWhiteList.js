const {

	addFullPathToWhiteList: mainAddFullPathToWhiteList,
	addProjectPathToWhiteList: mainAddProjectPathToWhiteList,
	addDependencyToWhiteList: mainAddDependencyToWhiteList,
	addDependencyPathToWhiteList: mainAddDependencyPathToWhiteList,

} = require("../whiteListFunctionality");

const connectionsWhiteList = [];

function addFullPathToWhiteList(tryPass, path) {

	return mainAddFullPathToWhiteList(connectionsWhiteList, tryPass, path);

}

function addProjectPathToWhiteList(tryPass, projectPath) {

	return mainAddProjectPathToWhiteList(connectionsWhiteList, tryPass, projectPath);

}

function addDependencyToWhiteList(tryPass, dependencyName, projectPath) {

	return mainAddDependencyToWhiteList(connectionsWhiteList, tryPass, dependencyName, projectPath);

}

function addDependencyPathToWhiteList(tryPass, dependencyName, projectPath) {

	return mainAddDependencyPathToWhiteList(connectionsWhiteList, tryPass, dependencyName, projectPath);

}

module.exports = {

	whiteList: connectionsWhiteList,

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

};