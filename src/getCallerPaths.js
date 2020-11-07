const debug = !!process.argv.filter(el => el == "--debugP").length || process.env.debugP;

const isWindows = require("../dependencies/isWindows");

const isCallerPath = !isWindows
	? path => path[0] == "/"
	: path => path.match(/^[a-zA-Z]:\\/);

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

function main(callerPaths, errStack) {

	let inProcessScreening = true;

	let first = null;
	let second = null;

	for(let i = 0; i < errStack.length; ++i) {

		const path = errStack[i].getFileName();

		if(
			inProcessScreening
			&&
			(

				endsWithTranslationSlashes(path, "/node-rules-system/src/getCallerPaths.js")
				||
				endsWithTranslationSlashes(path, "/node-rules-system/src/secureSession.js")
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

			first = path;

			continue;

		}

		if(
			isCallerPath(path)
			&&
			(
				(i + 1) < errStack.length
				&&
				!isCallerPath(errStack[i + 1].getFileName())
			)
		) {

			second = path;

			break;

		}

	}

	if(!first) return callerPaths;

	if(first && !second) second = first;

	return [first, second];

}

function getCallerPaths() {

	const originalFunc = Error.prepareStackTrace;

	let callerPaths = null;

	try {

		const err = new Error();

		Error.prepareStackTrace = function (err, stack) { return stack; };

		callerPaths = main(callerPaths, err.stack)

	} catch (e) {}

	Error.prepareStackTrace = originalFunc;

	debug && console.log("getCallerPaths", callerPaths);

	return callerPaths;

}

module.exports = getCallerPaths;