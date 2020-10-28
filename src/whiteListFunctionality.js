const { password, needToSetPassword, wrongPass } = require("./password");

const fs = require("fs");
const nodePath = require("path");

const isWindows = require("./isWindows");
const pathDelimiter = isWindows ? "\\" : "/";

let $cwd = null;

function withLastDelimiter(str) {

	if(typeof str == "string") {

		return str[str.length - 1] == pathDelimiter ? str : str + pathDelimiter;

	} else {

		return arguments[0];

	}

}

function findCWD(path, lastPath) {

	let cwd = path || process.cwd();

	if(fs.existsSync(cwd + pathDelimiter + "package.json")) return withLastDelimiter(cwd);

	const newPath = nodePath.resolve(cwd, "..");

	if(newPath == lastPath) return withLastDelimiter(process.cwd());

	return findCWD(newPath, cwd);

}

function addFullPathToWhiteList(whiteList, tryPass, path) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(typeof path != "string") return false;

	whiteList.push([path, path]);

	return true;

}

function addProjectPathToWhiteList(whiteList, tryPass, projectPath) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(typeof projectPath != "string") return false;

	if(!$cwd) $cwd = findCWD();

	whiteList.push([
		$cwd + projectPath,
		$cwd + projectPath
	]);

	return true;

}

function addDependencyToWhiteList(whiteList, tryPass, dependencyName, projectPath) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(typeof dependencyName != "string" || typeof projectPath != "string") return false;

	if(!$cwd) $cwd = findCWD();

	whiteList.push([

		$cwd + projectPath,
		$cwd + "node_modules" + pathDelimiter + withLastDelimiter(dependencyName)

	]);

	return true;

}

function addDependencyPathToWhiteList(whiteList, tryPass, dependencyName, projectPath) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(typeof dependencyName != "string" || typeof projectPath != "string") return false;

	if(!$cwd) $cwd = findCWD();

	whiteList.push([

		$cwd + projectPath,
		$cwd + "node_modules" + pathDelimiter + dependencyName

	]);

	return true;

}

module.exports = {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

};