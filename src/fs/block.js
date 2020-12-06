const fs = require("fs");

const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const checkAccess = require("../integrateFunctionality/checkAccess");

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

			if(fullBlock) {

				return returnProxy;

			}

			const callerPaths = getCallerPaths();

			if (!callerPaths.length) {

				debug.integrate("fsPromisesOpen->false", callerPaths);

				return returnProxy;

			}

			debug.integrate("fsPromisesOpen->true", callerPaths);

			for (let i = 0; i < whiteList.length; ++i) {

				const {

					customHandler,

				} = whiteList[i];

				let access = false;

				if(typeof customHandler == "function") {

					access = !!customHandler("callFsPromisesOpen", {

						callerPaths,
						callerFnName: getCallerFnName(),

						args: arguments,

					});

				} else {

					const {

						paths,
						blackPaths,

						callerFnName,
						onlyWhited,
						everyWhite,
						fullIdentify,

					} = whiteList[i];

					access = checkAccess({

						callerPaths,

						paths,
						blackPaths,

						callerFnName,
						onlyWhited,
						everyWhite,
						fullIdentify,

					});

				}

				if(access) {

					return $fsPromises.open(path, flags, mode);

				}

			}

			debug.integrate("fsPromisesOpen->", false);

			return returnProxy;

		};

		fsPromisesStatus = true;
		$fsPromises.status = true;

	} else if(!fsPromisesSupport) {

		fsPromisesStatus = null;

	}

	return [fsStatus, fsPromisesStatus];

}

module.exports = fsBlockWriteAndChange;