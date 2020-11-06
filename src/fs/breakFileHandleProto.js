const returnProxy = require("../returnProxy");

module.exports = function (filehandle) {

	[

		"appendFile",

		"chmod", "chown",

		"datasync", "sync",

		"truncate",

		"utimes",

		"write", "writeFile", "writev",

	].forEach(el => {

		filehandle[el] = returnProxy;
		filehandle.__proto__ = returnProxy;

	});

};