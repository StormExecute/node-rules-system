const {

	addFullPathToWhiteList: mainAddFullPathToWhiteList,
	addProjectPathToWhiteList: mainAddProjectPathToWhiteList,
	addDependencyToWhiteList: mainAddDependencyToWhiteList,
	addDependencyPathToWhiteList: mainAddDependencyPathToWhiteList,

} = require("../whiteListFunctionality");

const connectionsWhiteList = [];

function addFullPathToWhiteList(tryPass, wrapPath, nativePath) {

	return mainAddFullPathToWhiteList(connectionsWhiteList, tryPass, wrapPath, nativePath);

}

function addProjectPathToWhiteList(tryPass, wrapPath, nativePath) {

	return mainAddProjectPathToWhiteList(connectionsWhiteList, tryPass, wrapPath, nativePath);

}

function addDependencyToWhiteList(tryPass, dependencyNativePath, projectWrapPath) {

	return mainAddDependencyToWhiteList(connectionsWhiteList, tryPass, dependencyNativePath, projectWrapPath);

}

function addDependencyPathToWhiteList(tryPass, dependencyNativePath, projectWrapPath) {

	return mainAddDependencyPathToWhiteList(connectionsWhiteList, tryPass, dependencyNativePath, projectWrapPath);

}

module.exports = {

	whiteList: connectionsWhiteList,

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

};