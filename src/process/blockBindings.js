const { password, needToSetPassword, wrongPass } = require("../password");

const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const isObject = require("../../dependencies/isObject");

const { logsEmitter, wrongPassEmitter } = require("../logs");

const {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

} = require("../whiteListFunctionality");

const $process = require("./storeBindings");

const block = {};

["binding", "_linkedBinding", "dlopen"].forEach(el => {

	//{ returnProxyInsteadThrow, whiteList, whiteListType }
	block[el] = function (tryPass, options) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, el, { options })

		if(el == "binding" && $process.statusBinding == true) return false;
		if(el == "_linkedBinding" && $process.statusLinkedBinding == true) return false;
		if(el == "dlopen" && $process.statusDlopen == true) return false;

		const opts = isObject(options) ? Object.assign({}, options) : {};

		const whiteList = [];

		if(typeof opts["whiteListType"] == "string" && Array.isArray(opts.whiteList)) {

			if (opts["whiteListType"] == "full") {

				addFullPathToWhiteList(whiteList, tryPass, opts.whiteList);

			} else if (opts["whiteListType"] == "dependency") {

				addDependencyToWhiteList(whiteList, tryPass, opts.whiteList);

			} else if (opts["whiteListType"] == "dependencyPath") {

				addDependencyPathToWhiteList(whiteList, tryPass, opts.whiteList);

			} else {

				addProjectPathToWhiteList(whiteList, tryPass, opts.whiteList);

			}

		}

		const blockedReturn = function (module, nativePath, wrapPath) {

			nativePath = nativePath || "";
			wrapPath = wrapPath || "";

			logsEmitter("callFn", [nativePath || undefined, wrapPath || undefined], {

				grantRights: false,

				fn: el,
				args: module,

				calledAsClass: null,

			});

			if(typeof opts["returnProxyInsteadThrow"] == "boolean") return returnProxy;

			throw new Error("[node-rules-system] The script does not have access to process." + el + "!\n"
				+ "NativePath: " + nativePath + "\n"
				+ "WrapPath: " + wrapPath) + "\n";

		}

		$process[el] = process[el];

		process[el] = function (module) {

			const callerPaths = getCallerPaths();

			if (!callerPaths) return blockedReturn(module);

			const [nativePath, wrapPath] = callerPaths;

			for (let i = 0; i < whiteList.length; ++i) {

				if (
					nativePath.startsWith(whiteList[i][0])
					&&
					wrapPath.startsWith(whiteList[i][1])
				) {

					logsEmitter("callFn", [nativePath, wrapPath], {

						grantRights: true,

						fn: el,
						args: module,

						calledAsClass: null,

					});

					return $process[el](module);

				}

			}

			return blockedReturn(module, nativePath, wrapPath);

		};

		if(el == "binding") $process.statusBinding = true;
		else if(el == "_linkedBinding") $process.statusLinkedBinding = true;
		else if(el == "dlopen") $process.statusDlopen = true;

		return true;

	};

});

block.blockAll = function (tryPass, options) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	return [

		block["binding"](tryPass, options),
		block["_linkedBinding"](tryPass, options),
		block["dlopen"](tryPass, options),

	];

};

module.exports = block;