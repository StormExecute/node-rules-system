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
	SyncWriteStream: null,

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

module.exports = {

	$fs,
	$fsPromises,

	$fsList,
	$fsPromisesList,

};