function getCallerFilename() {

	const originalFunc = Error.prepareStackTrace;

	const err = new Error();

	Error.prepareStackTrace = function (err, stack) { return stack; };

	const result = err.stack[2].getFileName();

	Error.prepareStackTrace = originalFunc;

	return result;

}

module.exports = getCallerFilename;