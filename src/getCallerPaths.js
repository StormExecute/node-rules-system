const {

	ArraySplice,
	ArrayPush,

	StringMatch,

} = require("./_data/primordials");

const debug = require("./_debug");

const timersPathsStore = require("./timers/pathsStore");

const isWindows = require("../dependencies/isWindows");

const isCallerPath = !isWindows
	? path => path && path[0] == "/"
	: path => path && StringMatch( path, /^[a-zA-Z]:\\/ );

function endsWithTranslationSlashes(str, arg) {

	if(arg.length > str.length) return false;

	let strSymPointer = str.length - 1;

	for (let i = arg.length - 1; i >= 0; --i) {

		const symArg = arg[i];
		const symStr = str[strSymPointer--];

		//to support windows slashes
		if(symStr == "\\" && symArg == "/") continue;

		if(symStr != symArg) return false;

	}

	return true;

}

function parseStack(errStack) {

	let inProcessScreening = true;
	let parentTPId = false;

	const result = [];

	const debugFileNames = [];

	for (let i = 0; i < errStack.length; ++i) {

		debugFileNames[ debugFileNames.length ] = errStack[i].getFileName();

	}

	debug.fileNames("debugFileNames", debugFileNames);

	for(let i = 0; i < errStack.length; ++i) {

		let path = debugFileNames[i];

		//to skip ALL nulls, it is assumed that they are in the "inProcessScreening" state
		//but they may also be in a different state
		if(!path) continue;

		//for esm
		path = path.replace("file://", "");

		const fnName = errStack[i].getFunctionName();

		if(!parentTPId && timersPathsStore[fnName]) {

			parentTPId = fnName;

		}

		if(
			inProcessScreening
			&&
			(

				endsWithTranslationSlashes(path, "/node-rules-system/lib/NRS.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/getCallerPaths.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/secureSession.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/session.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/logs.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/password.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/_settings/main.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/getFunctionality.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/whiteListFunctionality.js")

				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/cluster/addToWhiteList.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/worker_threads/addToWhiteList.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/dgram/addToWhiteList.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/child_process/addToWhiteList.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/connections/addToWhiteList.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/fs/addToWhiteList.js")

				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/cluster/allow.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/worker_threads/allow.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/dgram/allow.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/child_process/allow.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/process/allowBindings.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/connections/allow.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/fs/allow.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/timers/restore.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/module/restore.js")

				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/cluster/block.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/worker_threads/block.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/dgram/block.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/child_process/block.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/process/blockBindings.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/connections/block.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/fs/block.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/timers/integrate.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/module/secureRequirePatch.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/module/dependencyController.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/module/wrap.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/module/extendWrap.js")

				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/integrateFunctionality/toFns.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/integrateFunctionality/toObject.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/integrateFunctionality/toProtoFn.js")

			)
		) {

			continue;

		}

		if(inProcessScreening) {

			inProcessScreening = false;

			//anyway push path
			result[ result.length ] = path;

			continue;

		}

		if(isCallerPath(path)) {

			result[ result.length ] = path;

		} else {

			break;

		}

	}

	if(parentTPId) {

		const copyParent = [];

		for (let i = 0; i < timersPathsStore[parentTPId].length; ++i) {

			copyParent[ copyParent.length ] = timersPathsStore[parentTPId][i];

		}

		for (let i = result.length - 1; i >= 0; i--) {

			if(
				!endsWithTranslationSlashes(result[i], "node-rules-system/src/timers/integrate.js")
			) {

				ArraySplice(copyParent, 0, 0, result[i]);

			}

		}

		return copyParent;

	}

	return result;

}

function getCallerPaths() {

	const originalFunc = Error.prepareStackTrace;

	const err = new Error();

	Error.prepareStackTrace = function (err, stack) { return stack; };
	const errStack = err.stack;
	Error.prepareStackTrace = originalFunc;

	const callerPaths = parseStack(errStack);

	debug.getCallerPaths("getCallerPaths", callerPaths);

	return callerPaths;

}

getCallerPaths.isCallerPath = isCallerPath;

module.exports = getCallerPaths;