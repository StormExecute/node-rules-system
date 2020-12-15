const {

	ObjectAssign,
	ArrayIsArray,

	EventEmitter,

} = require("./_data/primordials");

const isObject = require("../dependencies/isObject");

const getCallerPaths = require("./getCallerPaths");

const settings = require("./_settings/store");

class NRSLogs extends EventEmitter {

	onMany(eventsArray, listener) {

		if(!ArrayIsArray(eventsArray)) return this;

		for (let i = 0; i < eventsArray.length; ++i) {

			if(typeof eventsArray[i] == "string") {

				this.on(eventsArray[i], listener);

			}

		}

		return this;

	}

}

const logs = new NRSLogs();

let recordAllLogs = false;

const allLogs = [];

//setPassword, passwordAlready, changePassword, wrongChangePassword, wrongPassword,
//callFn, callObj, callProtoFn, callFromBlockBindings, callFromSecureSession, callFromFsPromisesOpen
//get, addToWhiteList, attempToChangeModuleWrap
function logsEmitter(type, customCallerPaths, details, force) {

	details = isObject(details) ? details : {};

	let callerPaths = customCallerPaths || getCallerPaths();

	if(!callerPaths.length) callerPaths = [];

	const message = {

		type,

		callerPaths,

	};

	for(const prop in details) {

		message[prop] = details[prop];

	}

	if(recordAllLogs || force) allLogs[ allLogs.length ] = message;

	logs.emit(message.type, message);
	logs.emit("*", message);

	return message;

}

logsEmitter.force = function (type, customCallerPaths, details) {

	return this(type, customCallerPaths, details, true);

};

function wrongPassEmitter(wrongPass, where, details) {

	details = isObject(details) ? details : {};

	const message = {

		grantRights: false,

		where,

	};

	for(const prop in details) {

		message[prop] = details[prop];

	}

	logsEmitter("wrongPassword", null, message);

	if(settings.throwIfWrongPassword) throw new Error(wrongPass);

	return false;

}

module.exports = {

	//for NRS core
	logsEmitter,
	wrongPassEmitter,

	make: function (password, needToSetPassword, wrongPass) {

		return {

			startRecordLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) return wrongPassEmitter(wrongPass, "startRecordLogs");

				recordAllLogs = true;

				return true;

			},

			stopRecordLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) return wrongPassEmitter(wrongPass, "stopRecordLogs");

				recordAllLogs = false;

				return true;

			},

			getAllLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) return wrongPassEmitter(wrongPass, "getAllLogs");

				return ObjectAssign([], allLogs);

			},

			getLogsEmitter: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) return wrongPassEmitter(wrongPass, "getLogsEmitter");

				return logs;

			},

		};

	},

};