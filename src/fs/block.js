const fs = require("fs");

const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const getCallerPaths = require("../getCallerPaths");
const getCallerFnName = require("../getCallerFnName");

const returnProxy = require("../returnProxy");

const debug = require("../_debug");

const { whiteList } = require("./addToWhiteList");

const {

	$fs,
	$fsPromises,

	$fsList,
	$fsPromisesList,

} = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");

const breakFileHandleProto = require("./breakFileHandleProto");

const needProcessVersion = require("../../dependencies/needProcessVersion");
const fsPromisesSupport = ~needProcessVersion("10.0.0");

function fsBlockWriteAndChange(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockFs");

	let fsStatus = false;
	let fsPromisesStatus = false;

	if($fs.status == false) {

		integrateToFns(whiteList, $fsList, fs, $fs, ["fs.js", "internal/fs/streams.js"], fullBlock);

		fsStatus = true;
		$fs.status = true;

	}

	if(fsPromisesSupport && $fsPromises.status == false) {

		integrateToFns(whiteList, $fsPromisesList, fs.promises, $fsPromises, [], fullBlock);

		$fsPromises.open = fs.promises.open;

		fs.promises.open = async function (path, flags, mode) {

			const filehandle = await $fsPromises.open(path, flags, mode);

			if(fullBlock) {

				breakFileHandleProto(filehandle);

				return filehandle;

			}

			const callerPaths = getCallerPaths();

			if (!callerPaths.length) {

				breakFileHandleProto(filehandle);

				debug.integrate("fsPromisesOpen->false", callerPaths);

				return filehandle;

			}

			debug.integrate("fsPromisesOpen->true", callerPaths);

			for (let i = 0; i < whiteList.length; ++i) {

				const { callerFnName, paths } = whiteList[i];

				if(typeof callerFnName == "string") {

					if(getCallerFnName() != callerFnName) continue;

				}

				if( !callerPaths[0].startsWith( paths[0] ) ) {

					continue;

				}

				let l = 1;

				for(let j = 0; j < callerPaths.length; ++j) {

					if((l + 1) > paths.length) break;

					const callerPath = callerPaths[j];

					if( callerPath.startsWith( paths[l] ) ) {

						++l;

					}

				}

				if(l && l == paths.length) {

					return filehandle;

				}

			}

			breakFileHandleProto(filehandle);

			debug.integrate("fsPromisesOpen->", false);

			return filehandle;

		};

		fsPromisesStatus = true;
		$fsPromises.status = true;

	} else if(!fsPromisesSupport) {

		fsPromisesStatus = null;

	}

	return [fsStatus, fsPromisesStatus];

}

module.exports = fsBlockWriteAndChange;