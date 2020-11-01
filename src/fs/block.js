const fs = require("fs");

const { password, needToSetPassword, wrongPass } = require("../password");

const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const { whiteList } = require("./addToWhiteList");

const integrateToFns = require("../integrateFunctionality/toFns");
const restore = require("../restore");

const $fs = {

	status: false,

	appendFile: null,
	appendFileSync: null,

	chmod: null,
	chmodSync: null,

	chown: null,
	chownSync: null,

	copyFile: null,
	copyFileSync: null,

	createWriteStream: null,

	fchmod: null,
	fchmodSync: null,

	fchown: null,
	fchownSync: null,

	fdatasync: null,
	fdatasyncSync: null,

	fsync: null,
	fsyncSync: null,

	ftruncate: null,
	ftruncateSync: null,

	futimes: null,
	futimesSync: null,

	lchmod: null,
	lchmodSync: null,

	lchown: null,
	lchownSync: null,

	lutimes: null,
	lutimesSync: null,

	link: null,
	linkSync: null,

	mkdir: null,
	mkdirSync: null,

	mkdtemp: null,
	mkdtempSync: null,

	rename: null,
	renameSync: null,

	rmdir: null,
	rmdirSync: null,

	rm: null,
	rmSync: null,

	symlink: null,
	symlinkSync: null,

	truncate: null,
	truncateSync: null,

	unlink: null,
	unlinkSync: null,

	utimes: null,
	utimesSync: null,

	write: null,
	writeSync: null,

	writeFile: null,
	writeFileSync: null,

	writev: null,
	writevSync: null,

};

const $fsPromises = {

	status: false,

	open: null,

	copyFile: null,

	rename: null,

	truncate: null,

	rm: null,
	rmdir: null,

	mkdir: null,

	symlink: null,
	link: null,

	unlink: null,

	chmod: null,
	lchmod: null,

	lchown: null,
	chown: null,

	utimes: null,
	lutimes: null,

	mkdtemp: null,

	writeFile: null,
	appendFile: null,

};

const $fsList = [

	"appendFile", "appendFileSync",

	"chmod", "chmodSync",
	"chown", "chownSync",

	"copyFile", "copyFileSync",

	"createWriteStream",

	"fchmod", "fchmodSync",
	"fchown", "fchownSync",

	"fdatasync", "fdatasyncSync",
	"fsync", "fsyncSync",

	"ftruncate", "ftruncateSync",
	"futimes", "futimesSync",

	"lchmod", "lchmodSync",
	"lchown", "lchownSync",

	"lutimes", "lutimesSync",

	"link", "linkSync",

	"mkdir", "mkdirSync",
	"mkdtemp", "mkdtempSync",

	"rename", "renameSync",

	"rmdir", "rmdirSync",
	"rm", "rmSync",

	"symlink", "symlinkSync",

	"truncate", "truncateSync",

	"unlink", "unlinkSync",

	"utimes", "utimesSync",

	"write", "writeSync",
	"writeFile", "writeFileSync",
	"writev", "writevSync",

];

const $fsPromisesList = [

	"copyFile",

	"rename",

	"truncate",

	"rm", "rmdir", "mkdir",

	"symlink", "link", "unlink",

	"chmod", "lchmod",

	"lchown", "chown",

	"utimes", "lutimes",

	"mkdtemp",

	"writeFile", "appendFile",

];

function breakFileHandleProto(filehandle) {

	[

		"appendFile",

		"chmod", "chown",

		"datasync", "sync",

		"truncate",

		"utimes",

		"write", "writeFile", "writev",

	].forEach(el => {

		filehandle[el] = returnProxy;
		filehandle.__proto__[el] = returnProxy;

	});

}

function fsBlockWriteAndChange(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	let fsStatus = false;
	let fsPromisesStatus = false;

	if($fs.status == false) {

		integrateToFns(whiteList, $fsList, fs, $fs, ["fs.js"], fullBlock);

		fsStatus = true;
		$fs.status = true;

	}

	if($fsPromises.status == false) {

		integrateToFns(whiteList, $fsPromisesList, fs.promises, $fsPromises, [], fullBlock);

		$fsPromises.open = fs.promises.open;

		fs.promises.open = async function (path, flags, mode) {

			const filehandle = await $fsPromises.open(path, flags, mode);

			if(fullBlock) {

				breakFileHandleProto(filehandle);

				return filehandle;

			}

			const callerPaths = getCallerPaths();

			if (!callerPaths) {

				breakFileHandleProto(filehandle);

				return filehandle;

			}

			const [callerFile, dependencyPath] = callerPaths;

			for (let i = 0; i < whiteList.length; ++i) {

				if (
					callerFile.startsWith(whiteList[i][0])
					&&
					dependencyPath.startsWith(whiteList[i][1])
				) {

					return filehandle;

				}

			}

			breakFileHandleProto(filehandle);

			return filehandle;

		};

		fsPromisesStatus = true;
		$fsPromises.status = true;

	}

	return [fsStatus, fsPromisesStatus];

}

function fsAllowWriteAndChange(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	let fsStatus = false;
	let fsPromisesStatus = false;

	if($fs.status == true) {

		restore($fsList, fs, $fs);

		fsStatus = true;
		$fs.status = false;

	}

	if($fsPromises.status == true) {

		restore($fsPromisesList.concat( [ "open" ] ), fs.promises, $fsPromises);

		fsPromisesStatus = true;
		$fsPromises.status = false;

	}

	return [fsStatus, fsPromisesStatus];

}

module.exports = {

	$fs,
	$fsPromises,

	fsBlockWriteAndChange,
	fsAllowWriteAndChange,

};