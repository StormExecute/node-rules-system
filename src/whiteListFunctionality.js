const { password, needToSetPassword, wrongPass } = require("./password");

const { logsEmitter, wrongPassEmitter } = require("./logs");

const fs = require("fs");
const nodePath = require("path");

const isWindows = require("../dependencies/isWindows");
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

function emitWhiteList(grantRights, whiteList, args) {

	logsEmitter("addToWhiteList", null, {

		$cwd,
		whiteList: whiteList.name,
		grantRights,
		args,

	});

	return grantRights;

}

function addToWhiteList(whiteList, preFn, nextArgsArray) {

	if(!nextArgsArray.length) return emitWhiteList(false, whiteList, nextArgsArray);

	let result = false;

	if(Array.isArray(nextArgsArray[0])) {

		for(let i = 0; i < nextArgsArray.length; ++i) {

			const arr = nextArgsArray[i];

			if(arr.length == 1 && typeof arr[0] == "string") {

				const [nativePath, wrapPath] = preFn(arr[0], arr[0]);

				whiteList.push([nativePath, wrapPath]);

				!result && (result = true);

			} else if(arr.length == 2 && typeof arr[1] == "string") {

				const [nativePath, wrapPath] = preFn(arr[1], arr[0]);

				whiteList.push([nativePath, wrapPath]);

				!result && (result = true);

			}

		}

	} else if(typeof nextArgsArray[0] == "string") {

		if(nextArgsArray.length == 1) {

			const [nativePath, wrapPath] = preFn(nextArgsArray[0], nextArgsArray[0]);

			whiteList.push([nativePath, wrapPath]);

			!result && (result = true);

		} else if(nextArgsArray.length == 2 && typeof nextArgsArray[1] == "string") {

			const [nativePath, wrapPath] = preFn(nextArgsArray[1], nextArgsArray[0]);

			whiteList.push([nativePath, wrapPath]);

			!result && (result = true);

		}

	} else return emitWhiteList(false, whiteList, nextArgsArray);

	emitWhiteList(result, whiteList, nextArgsArray);

	return result;

}

function addFullPathToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addFullPathToWhiteList", { argsArray })

	return addToWhiteList(whiteList, (nativePath, wrapPath) => {

		return [nativePath, wrapPath];

	}, argsArray);

}

function addProjectPathToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addProjectPathToWhiteList", { argsArray })

	return addToWhiteList(whiteList, (nativePath, wrapPath) => {

		if(!$cwd) $cwd = findCWD();

		return [

			nodePath.join($cwd, nativePath),
			nodePath.join($cwd, wrapPath),

		];

	}, argsArray);

}

function addDependencyToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addDependencyToWhiteList", { argsArray })

	return addToWhiteList(whiteList, (projectWrapPath, dependencyNativePath) => {

		if(!$cwd) $cwd = findCWD();

		return [

			nodePath.join($cwd + "./node_modules", pathDelimiter + withLastDelimiter(dependencyNativePath)),
			nodePath.join($cwd, projectWrapPath),

		];

	}, argsArray);

}

function addDependencyPathToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addDependencyPathToWhiteList", { argsArray })

	return addToWhiteList(whiteList, (projectWrapPath, dependencyNativePath) => {

		if(!$cwd) $cwd = findCWD();

		return [

			nodePath.join($cwd + "./node_modules", pathDelimiter + dependencyNativePath),
			nodePath.join($cwd, projectWrapPath),

		];

	}, argsArray);

}

module.exports = {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

};