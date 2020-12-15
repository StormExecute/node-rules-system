const { processArgv } = require("./_data/primordials");

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

		if(process.env[arg]) return true;

		for (let i = 0; i < processArgv.length; ++i) {

			if( processArgv[i] == "--nrs-" + arg ) {

				return true;

			}

		}

		return false;

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