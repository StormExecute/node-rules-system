const debugMethods = ["integrate", "getCallerPaths", "fileNames", "timers", "other"];
const debugShortMethods = ["debugI", "debugP", "debugF", "debugT", "debugO"];

class debugC {

	constructor() {

		this.consoleLog = console.log;

		if(this.haveArg("debugAll")) {

			for (let i = 0; i < debugMethods.length; ++i) {

				this[ "$" + debugMethods[i] ] = true;

			}

		} else {

			for (let i = 0; i < debugMethods.length; ++i) {

				this[ "$" + debugMethods[i] ] = this.haveArg( debugShortMethods[i] );

			}

		}

	}

	haveArg(arg) {

		return !!process.argv.filter(el => el == "--nrs-" + arg).length || process.env[arg];

	}

	log() {

		this.consoleLog(...arguments);

		return true;

	}

	_log(method, ...args) {

		if(this["inProcessLog" + method]) return false;

		this["inProcessLog" + method] = true;

		this.consoleLog(...args);

		this["inProcessLog" + method] = false;

		return true;

	}

	integrate(){}
	getCallerPaths(){}
	fileNames(){}
	timers(){}
	other(){}

}

for (let i = 0; i < debugMethods.length; ++i) {

	debugC.prototype[debugMethods[i]] = function () {

		if( this[ "$" + debugMethods[i] ] ) {

			return this._log(debugMethods[i], ...arguments);

		}

		return false;

	}

}

const debug = new debugC;

module.exports = debug;