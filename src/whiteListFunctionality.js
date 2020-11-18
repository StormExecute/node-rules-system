const { password, needToSetPassword, wrongPass } = require("./password");

const { logsEmitter, wrongPassEmitter } = require("./logs");

const fs = require("fs");
const nodePath = require("path");

const isObject = require("../dependencies/isObject");

const isWindows = require("../dependencies/isWindows");
const pathDelimiter = isWindows ? "\\" : "/";

const $corePath = { value: null };

function withLastDelimiter(str) {

	if(typeof str != "string") return arguments[0];

	return str[str.length - 1] == pathDelimiter ? str : str + pathDelimiter;

}

function findCorePath(path, lastPath) {

	const cwd = path || process.cwd();

	if(fs.existsSync(cwd + pathDelimiter + "package.json")) return withLastDelimiter(cwd);

	const newPath = nodePath.resolve(cwd, "..");

	if(newPath == lastPath) return withLastDelimiter(process.cwd());

	return findCorePath(newPath, cwd);

}

$corePath.value = findCorePath();

const nm = () => withLastDelimiter("node_modules");

function dep(path) {

	if(typeof path != "string") return false;

	if(path.startsWith($corePath.value)) {

		return nm() + path;

	} else {

		return $corePath.value + nm() + path;

	}

}

function depD(path) {

	if(typeof path != "string") return false;

	if(path.startsWith($corePath.value)) {

		return withLastDelimiter(nm() + path);

	} else {

		return withLastDelimiter($corePath.value + nm() + path);

	}

}

function core(path) {

	if(typeof path != "string") return false;

	if(path.startsWith($corePath.value)) return path;

	return $corePath.value + path;

}

function coreD(path) {

	if(typeof path != "string") return false;

	if(path.startsWith($corePath.value)) return path;

	return withLastDelimiter($corePath.value + path);

}

function emitWhiteList(grantRights, whiteList, args) {

	logsEmitter("addToWhiteList", null, {

		$corePath: $corePath.value,
		whiteList: whiteList.name,
		grantRights,
		args,

	});

	return grantRights;

}

function parseWhiteListArg(whiteList, arg, preFn, result) {

	if(Array.isArray(arg)) {

		const paths = [];

		for(let i = 0; i < arg.length; ++i) {

			if(typeof arg[i] == "string") {

				typeof preFn == "function"
					? paths.push( preFn( arg[i] ) )
					: paths.push( arg[i] )

			}

		}

		if(paths.length) {

			!result && (result = true);

			whiteList.push({

				paths,
				callerFnName: null,

			});

		}

	} else if(typeof arg == "string") {

		!result && (result = true);

		whiteList.push({

			paths: [ typeof preFn == "function" ? preFn(arg) : arg ],
			callerFnName: null,

		});

	} else if(isObject(arg)) {

		const paths = typeof arg.paths == "string"
			? [typeof preFn == "function" ? preFn(arg.paths) : arg.paths]
			: [];

		if(Array.isArray(arg.paths)) {

			for(let i = 0; i < arg.paths.length; ++i) {

				if(typeof arg.paths[i] == "string") {

					typeof preFn == "function"
						? paths.push( preFn( arg.paths[i] ) )
						: paths.push( arg.paths[i] )

				}

			}

		}

		if(paths.length) {

			!result && (result = true);

			whiteList.push({

				paths,
				callerFnName: typeof arg.callerFnName == "string" ? arg.callerFnName : null,

			});

		}

	}

	return result;

}

function addToWhiteList(whiteList, preFn, nextArgsArray) {

	if(!nextArgsArray.length) return emitWhiteList(false, whiteList, nextArgsArray);

	let result = false;

	for(let i = 0; i < nextArgsArray.length; ++i) {

		result = parseWhiteListArg( whiteList, nextArgsArray[i], preFn, result );

		if(typeof nextArgsArray[i] == "function") {

			result = parseWhiteListArg( whiteList, nextArgsArray[i]({

				dep,
				depD,

				core,
				coreD,

				$corePath: $corePath.value,
				findCorePath,

			}), preFn, result );

		}

	}

	emitWhiteList(result, whiteList, nextArgsArray);

	return result;

}

function addCustomPathsToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addCustomPathsToWhiteList", { argsArray })

	return addToWhiteList(whiteList, path => {

		return path;

	}, argsArray);

}

function addPathsToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addPathsToWhiteList", { argsArray });

	return addToWhiteList(whiteList, path => {

		return nodePath.join($corePath.value, path);

	}, argsArray);

}

function addDependencyAndPathsToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addDependencyAndPathsToWhiteList", { argsArray });

	let dependencyI = true;

	return addToWhiteList(whiteList, path => {

		if(dependencyI) {

			dependencyI = false;

			return withLastDelimiter( nodePath.join($corePath.value + nm(), path) );

		}

		return nodePath.join($corePath.value, path);

	}, argsArray);

}

function addDependencyPathAndProjectPathsToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addDependencyPathAndProjectPathsToWhiteList", { argsArray });

	let dependencyI = true;

	return addToWhiteList(whiteList, path => {

		if(dependencyI) {

			dependencyI = false;

			return nodePath.join($corePath.value + nm(), path);

		}

		return nodePath.join($corePath.value, path);

	}, argsArray);

}

module.exports = {

	$corePath,

	addCustomPathsToWhiteList,
	addPathsToWhiteList,

	addDependencyAndPathsToWhiteList,
	addDependencyPathAndProjectPathsToWhiteList,

};