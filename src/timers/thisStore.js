module.exports = {

	statusImmediate: false,
	statusNextTick: false,

	statusSetTimeout: false,
	statusSetInterval: false,

	statusPromiseThen: false,
	statusPromiseCatch: false,

	statusEventEmitterOn: false,

	setImmediate: null,
	nextTick: null,

	setTimeout: null,
	setInterval: null,

	then: null,
	"catch": null,

	on: null,

};