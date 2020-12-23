const { password, needToSetPassword, wrongPass } = require("./password");

const {

	ArrayIsArray,

	StringStartsWith,

	nodePathJoin,
	nodePathResolve,

	fsExistsSync,

} = require("./_data/primordials");

const { logsEmitter, wrongPassEmitter } = require("./logs");

const isObject = require("../dependencies/isObject");

const isWindows = require("../dependencies/isWindows");
const pathDelimiter = isWindows ? "\\" : "/";

const $corePath = { value: null };

const standardWhiteListMethods = [

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

];

function withLastDelimiter(str) {

	if(typeof str != "string") return arguments[0];

	return str[str.length - 1] == pathDelimiter ? str : str + pathDelimiter;

}

function findCorePath(path, lastPath) {

	const cwd = path || process.cwd();

	if(fsExistsSync(cwd + pathDelimiter + "package.json")) return withLastDelimiter(cwd);

	const newPath = nodePathResolve(cwd, "..");

	if(newPath == lastPath) return withLastDelimiter(process.cwd());

	return findCorePath(newPath, cwd);

}

$corePath.value = findCorePath();

const nm = () => withLastDelimiter("node_modules");

function dep(path) {

	if(typeof path != "string") return false;

	if(StringStartsWith( path, $corePath.value )) {

		return nm() + path;

	} else {

		return $corePath.value + nm() + path;

	}

}

function depD(path) {

	if(typeof path != "string") return false;

	if(StringStartsWith( path, $corePath.value )) {

		return withLastDelimiter(nm() + path);

	} else {

		return withLastDelimiter($corePath.value + nm() + path);

	}

}

function core(path) {

	if(typeof path != "string") return false;

	if(StringStartsWith( path, $corePath.value )) return path;

	return $corePath.value + path;

}

function coreD(path) {

	if(typeof path != "string") return false;

	if(StringStartsWith( path, $corePath.value )) return path;

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

	if(ArrayIsArray(arg)) {

		const paths = [];

		for(let i = 0; i < arg.length; ++i) {

			if(typeof arg[i] == "string") {

				typeof preFn == "function"
					? paths[ paths.length ] = preFn( arg[i] )
					: paths[ paths.length ] = arg[i]

			}

		}

		if(paths.length) {

			!result && (result = true);

			whiteList[ whiteList.length ] = {

				customHandler: null,
				paths,
				callerFnName: null,
				onlyWhited: null,
				blackPaths: null,
				everyWhite: null,
				fullIdentify: null,
				whiteListDomains: null,
				blackListDomains: null,

			};

		}

	} else if(typeof arg == "string") {

		!result && (result = true);

		whiteList[ whiteList.length ] = {

			customHandler: null,
			paths: [ typeof preFn == "function" ? preFn(arg) : arg ],
			callerFnName: null,
			onlyWhited: null,
			blackPaths: null,
			everyWhite: null,
			fullIdentify: null,
			whiteListDomains: null,
			blackListDomains: null,

		};

	} else if(isObject(arg)) {

		const paths = typeof arg.paths == "string"
			? [typeof preFn == "function" ? preFn(arg.paths) : arg.paths]
			: [];

		if(ArrayIsArray(arg.paths)) {

			for(let i = 0; i < arg.paths.length; ++i) {

				if(typeof arg.paths[i] == "string") {

					typeof preFn == "function"
						? paths[ paths.length ] = preFn( arg.paths[i] )
						: paths[ paths.length ] = arg.paths[i]

				}

			}

		}

		const blackPaths = typeof arg.blackPaths == "string"
			? [typeof preFn == "function" ? preFn(arg.blackPaths) : arg.blackPaths]
			: [];

		if(ArrayIsArray(arg.blackPaths)) {

			for(let i = 0; i < arg.blackPaths.length; ++i) {

				if(typeof arg.blackPaths[i] == "string") {

					typeof preFn == "function"
						? blackPaths[ paths.length ] = preFn( arg.blackPaths[i] )
						: blackPaths[ paths.length ] = arg.blackPaths[i]

				}

			}

		}

		const whiteListDomains = typeof arg.whiteListDomains == "string"
			? [arg.whiteListDomains]
			: [];

		if(ArrayIsArray(arg.whiteListDomains)) {

			for(let i = 0; i < arg.whiteListDomains.length; ++i) {

				if(typeof arg.whiteListDomains[i] == "string") {

					whiteListDomains[ whiteListDomains.length ] = arg.whiteListDomains[i];

				}

			}

		}

		const blackListDomains = typeof arg.blackListDomains == "string"
			? [arg.blackListDomains]
			: [];

		if(ArrayIsArray(arg.blackListDomains)) {

			for(let i = 0; i < arg.blackListDomains.length; ++i) {

				if(typeof arg.blackListDomains[i] == "string") {

					blackListDomains[ blackListDomains.length ] = arg.blackListDomains[i];

				}

			}

		}

		!result && (result = true);

		whiteList[ whiteList.length ] = {

			customHandler: typeof arg.customHandler == "function" ? arg.customHandler : null,
			paths,
			blackPaths,
			whiteListDomains,
			blackListDomains,
			callerFnName: typeof arg.callerFnName == "string" ? arg.callerFnName : null,
			onlyWhited: typeof arg.onlyWhited == "boolean" ? arg.onlyWhited : null,
			everyWhite: typeof arg.everyWhite == "boolean" ? arg.everyWhite : null,
			fullIdentify: typeof arg.fullIdentify == "boolean" ? arg.fullIdentify : null,

		};

	}

	return result;

}

function addToWhiteList(whiteList, preFn, nextArgsArray) {

	if(!nextArgsArray.length) return emitWhiteList(false, whiteList, nextArgsArray);

	let result = false;

	for(let i = 0; i < nextArgsArray.length; ++i) {

		if(typeof nextArgsArray[i] == "function") {

			result = parseWhiteListArg( whiteList, nextArgsArray[i]({

				dep,
				depD,

				core,
				coreD,

				$corePath: $corePath.value,
				findCorePath,

			}), preFn, result );

		} else {

			result = parseWhiteListArg( whiteList, nextArgsArray[i], preFn, result );

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

		return nodePathJoin($corePath.value, path);

	}, argsArray);

}

function addDependencyAndPathsToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addDependencyAndPathsToWhiteList", { argsArray });

	let dependencyI = true;

	return addToWhiteList(whiteList, path => {

		if(dependencyI) {

			dependencyI = false;

			return withLastDelimiter( nodePathJoin($corePath.value + nm(), path) );

		}

		return nodePathJoin($corePath.value, path);

	}, argsArray);

}

function addDependencyPathAndProjectPathsToWhiteList(whiteList, tryPass, argsArray) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "addDependencyPathAndProjectPathsToWhiteList", { argsArray });

	let dependencyI = true;

	return addToWhiteList(whiteList, path => {

		if(dependencyI) {

			dependencyI = false;

			return nodePathJoin($corePath.value + nm(), path);

		}

		return nodePathJoin($corePath.value, path);

	}, argsArray);

}

module.exports = {

	findCorePath,

	$corePath,
	standardWhiteListMethods,

	addCustomPathsToWhiteList,
	addPathsToWhiteList,

	addDependencyAndPathsToWhiteList,
	addDependencyPathAndProjectPathsToWhiteList,

};