const fs = require("fs");

const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const { whiteList } = require("./addToWhiteList");

const {

	$fs,
	$fsPromises,

	$fsList,
	$fsPromisesList,

} = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");

const breakFileHandleProto = require("./breakFileHandleProto");

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

module.exports = fsBlockWriteAndChange;