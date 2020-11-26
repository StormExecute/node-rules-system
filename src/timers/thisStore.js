module.exports = {

	statusImmediate: false,
	statusNextTick: false,

	statusSetTimeout: false,
	statusSetInterval: false,

	statusPromiseThen: false,
	statusPromiseCatch: false,

	statusEventEmitterOn: false,

	statusFsReadFile: false,
	statusFsWriteFile: false,

	setImmediate: null,
	nextTick: null,

	setTimeout: null,
	setInterval: null,

	then: null,
	"catch": null,

	on: null,

	fsReadFile: null,
	fsWriteFile: null,

};