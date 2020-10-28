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

function addFullPathToWhiteList(whiteList, tryPass, wrapPath, nativePath) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(!nativePath) nativePath = wrapPath;

	if(typeof wrapPath != "string" || typeof nativePath != "string") return false;

	whiteList.push([nativePath, wrapPath]);

	return true;

}

function addProjectPathToWhiteList(whiteList, tryPass, wrapPath, nativePath) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(!nativePath) nativePath = wrapPath;

	if(typeof wrapPath != "string" || typeof nativePath != "string") return false;

	if(!$cwd) $cwd = findCWD();

	whiteList.push([
		$cwd + nativePath,
		$cwd + wrapPath
	]);

	return true;

}

function addDependencyToWhiteList(whiteList, tryPass, dependencyNativePath, projectWrapPath) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(typeof dependencyNativePath != "string" || typeof projectWrapPath != "string") return false;

	if(!$cwd) $cwd = findCWD();

	whiteList.push([

		$cwd + "node_modules" + pathDelimiter + withLastDelimiter(dependencyNativePath),
		$cwd + projectWrapPath,

	]);

	return true;

}

function addDependencyPathToWhiteList(whiteList, tryPass, dependencyNativePath, projectWrapPath) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if(typeof dependencyNativePath != "string" || typeof projectWrapPath != "string") return false;

	if(!$cwd) $cwd = findCWD();

	whiteList.push([

		$cwd + "node_modules" + pathDelimiter + withLastDelimiter(dependencyNativePath),
		$cwd + projectWrapPath,

	]);

	return true;

}

module.exports = {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

};