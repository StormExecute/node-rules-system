const settings = require("../_settings/store");
const { prefixS } = require("../_data");
const { password, needToSetPassword, wrongPass } = require("../password");

const {

	ObjectAssign,

	ArrayIsArray,
	ArrayForEach,
	ArraySlice,
	ArrayJoin,

} = require("../_data/primordials");

const checkAccess = require("../integrateFunctionality/checkAccess");

const getCallerPaths = require("../getCallerPaths");
const getCallerFnName = require("../getCallerFnName");

const returnProxy = require("../returnProxy");

const debug = require("../_debug");

const isObject = require("../../dependencies/isObject");

const { logsEmitter, wrongPassEmitter } = require("../logs");

const {

	addCustomPathsToWhiteList,
	addPathsToWhiteList,
	addDependencyAndPathsToWhiteList,
	addDependencyPathAndProjectPathsToWhiteList,

} = require("../whiteListFunctionality");

const $process = require("./storeBindings");

const block = {};

ArrayForEach(["binding", "_linkedBinding", "dlopen"], el => {

	//{ returnProxyInsteadThrow, whiteLists, fullBlock }
	block[el] = function (tryPass, options) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) {

			const where = el == "binding" ? "Binding" : el == "_linkedBinding" ? "LinkedBinding" : "Dlopen";

			return wrongPassEmitter(wrongPass, "blockProcess" + where, { options })

		}

		if(el == "binding" && $process.statusBinding == true) return false;
		if(el == "_linkedBinding" && $process.statusLinkedBinding == true) return false;
		if(el == "dlopen" && $process.statusDlopen == true) return false;

		const opts = isObject(options) ? ObjectAssign({}, options) : {};

		const whiteList = [];
		whiteList.name = el;

		if(ArrayIsArray(opts["whiteLists"])) {

			for (let i = 0; i < opts["whiteLists"].length; ++i) {

				const wList = opts["whiteLists"][i];

				if(isObject(wList)) {

					if (typeof wList["type"] == "string" && ArrayIsArray(wList.list)) {

						if (wList["type"] == "custom") {

							addCustomPathsToWhiteList(whiteList, tryPass, wList.list);

						} else if (wList["type"] == "dependency") {

							addDependencyAndPathsToWhiteList(whiteList, tryPass, wList.list);

						} else if (wList["type"] == "dependencyPath") {

							addDependencyPathAndProjectPathsToWhiteList(whiteList, tryPass, wList.list);

						} else {

							addPathsToWhiteList(whiteList, tryPass, wList.list);

						}

					}

				}

			}

		}

		const blockedReturn = function (args, callerPaths) {

			const nativePath = callerPaths[0] || "missing";

			logsEmitter("callFromBlockBindings", callerPaths, {

				grantRights: false,

				fn: el,
				args,

				calledAsClass: null,

			});

			if(opts["returnProxyInsteadThrow"] == true) return returnProxy;

			throw new Error(prefixS + "The script does not have access to process." + el + "!\n\n"
				+ "NativePath: " + nativePath + "\n\n"
				+ "CallerPaths: " + ArrayJoin( ArraySlice(callerPaths, 1), ", ") + "\n\n"
			);

		}

		$process[el] = process[el];

		process[el] = function (module) {

			if(opts.fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if (!callerPaths.length) {

				debug.integrate("blockBindings->false", callerPaths);

				return blockedReturn(arguments, []);

			}

			debug.integrate("blockBindings->true", callerPaths);

			if(
				(
					!settings.useIsCallerPathInsteadTrustedAllowList
					&&
					(callerPaths[0] == "dns.js" || callerPaths[0] == "zlib.js")
				)
				||
				(
					settings.useIsCallerPathInsteadTrustedAllowList
					&&
					getCallerPaths.isCallerPath( callerPaths[0] )
				)
			) {

				return $process[el](module);

			}

			for (let i = 0; i < whiteList.length; ++i) {

				const {

					customHandler,

				} = whiteList[i];

				let access = false;

				if(typeof customHandler == "function") {

					access = !!customHandler("callFromBlockBindings", {

						callerPaths,
						callerFnName: getCallerFnName(),

						args: arguments,

						fn: el,

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

					logsEmitter("callFromBlockBindings", callerPaths, {

						grantRights: true,

						fn: el,
						args: arguments,

						calledAsClass: null,

					});

					return $process[el](module);

				}

			}

			debug.integrate("blockBindings->", false);

			return blockedReturn(arguments, callerPaths);

		};

		if(el == "binding") $process.statusBinding = true;
		else if(el == "_linkedBinding") $process.statusLinkedBinding = true;
		else if(el == "dlopen") $process.statusDlopen = true;

		return true;

	};

});

block.blockAll = function (tryPass, options) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockProcessBindingLinkedBindingAndDlopen");

	return [

		block["binding"](tryPass, options),
		block["_linkedBinding"](tryPass, options),
		block["dlopen"](tryPass, options),

	];

};

module.exports = block;