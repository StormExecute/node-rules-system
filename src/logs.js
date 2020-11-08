const isObject = require("../dependencies/isObject");

const getCallerPaths = require("./getCallerPaths");

const settings = require("./_settings/store");

const EventEmitter = require('events');
class NRSLogs extends EventEmitter {}
const logs = new NRSLogs();

let recordAllLogs = false;

const allLogs = [];

//setPassword, passwordAlready, changePassword, wrongChangePassword, wrongPassword,
// callFn, callObj, callProtoFn, get, callFromSecureSession, addToWhiteList
function logsEmitter(type, customCallerPaths, details, force) {

	details = isObject(details) ? details : {};

	let callerPaths = customCallerPaths || getCallerPaths();

	if(!callerPaths) callerPaths = [undefined, undefined];

	const message = {

		type,

		nativePath: callerPaths[0],
		wrapPath: callerPaths[1],

	};

	for(const prop in details) {

		message[prop] = details[prop];

	}

	if(recordAllLogs) allLogs.push(message);

	logs.emit(message.type, message);
	logs.emit("*", message);

	return force ? message : true;

}

logsEmitter.force = function (type, customCallerPaths, details) {

	const message = this(type, customCallerPaths, details, true);

	allLogs.push(message);

	return true;

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

	return true;

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

			},

			stopRecordLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) return wrongPassEmitter(wrongPass, "stopRecordLogs");

				recordAllLogs = false;

			},

			getAllLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) return wrongPassEmitter(wrongPass, "getAllLogs");

				return Object.assign([], allLogs);

			},

			getLogsEmitter: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) return wrongPassEmitter(wrongPass, "getLogsEmitter");

				return logs;

			},

		};

	},

};