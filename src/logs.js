const isObject = require("../dependencies/isObject");

const getCallerPaths = require("./getCallerPaths");

const EventEmitter = require('events');
class NRSLogs extends EventEmitter {}
const logs = new NRSLogs();

let recordAllLogs = false;

const allLogs = [];

//setPassword, passwordAlready, changePassword, wrongChangePassword, wrongPassword, callFn, callObj, callProtoFn, get, callFromSecureSession
function logsEmitter(type, customCallerPaths, details) {

	details = isObject(details) ? details : {};

	let callerPaths = customCallerPaths || getCallerPaths();

	if(!callerPaths) callerPaths = [undefined, undefined];

	const message = {

		type,

		nativePath: callerPaths[0],
		wrapPath: callerPaths[1],

		...details

	};

	if(recordAllLogs) allLogs.push(message);

	logs.emit(message.type, message);
	logs.emit("*", message);

	return true;

}

function wrongPassEmitter(wrongPass, where, details) {

	details = isObject(details) ? details : {};

	logsEmitter("wrongPassword", null, {

		grantRights: false,

		where,

		...details

	});

	throw new Error(wrongPass);

}

module.exports = {

	//for NRS core
	logsEmitter,
	wrongPassEmitter,

	make: function (password, needToSetPassword, wrongPass) {

		return {

			startRecordLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) throw new Error(wrongPass);

				recordAllLogs = true;

			},

			stopRecordLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) throw new Error(wrongPass);

				recordAllLogs = false;

			},

			getAllLogs: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) throw new Error(wrongPass);

				return Object.assign([], allLogs);

			},

			getLogsEmitter: function (tryPass) {

				if (password.value === null) throw new Error(needToSetPassword);
				if (tryPass != password.value) throw new Error(wrongPass);

				return logs;

			},

		};

	},

};