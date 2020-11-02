const { password, needToSetPassword, wrongPass } = require("../password");

const getCallerPaths = require("../getCallerPaths");

const returnProxy = require("../returnProxy");

const isObject = require("../../dependencies/isObject");

const {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

} = require("../whiteListFunctionality");

const $process = {

	statusBinding: false,
	statusLinkedBinding: false,

	binding: null,
	_linkedBinding: null,

};

const block = {};

["binding", "_linkedBinding"].forEach(el => {

	//{ returnProxyInsteadThrow, whiteList, whiteListType }
	block[el] = function (tryPass, options) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) throw new Error(wrongPass);

		if(el == "binding" && $process.statusBinding == true) return false;
		if(el == "_linkedBinding" && $process.statusLinkedBinding == true) return false;

		const opts = isObject(options) ? Object.assign({}, options) : {};

		if(typeof opts["whiteListType"] != "string") {

			throw new Error("[node-rules-system] To block " + el + " you need to choose opts.whiteListType: project, full, dependency, dependencyPath!");

		}

		if(!Array.isArray(opts.whiteList)) throw new Error("[node-rules-system] To block " + el + " you need to set options.whiteList!");

		const whiteList = [];

		if(opts["whiteListType"] == "full") {

			addFullPathToWhiteList(whiteList, tryPass, opts.whiteList);

		} else if(opts["whiteListType"] == "dependency") {

			addDependencyToWhiteList(whiteList, tryPass, opts.whiteList);

		} else if(opts["whiteListType"] == "dependencyPath") {

			addDependencyPathToWhiteList(whiteList, tryPass, opts.whiteList);

		} else {

			addProjectPathToWhiteList(whiteList, tryPass, opts.whiteList);

		}

		const blockedReturn = function (nativePath, wrapPath) {

			nativePath = nativePath || "";
			wrapPath = wrapPath || "";

			if(typeof opts["returnProxyInsteadThrow"] == "boolean") return returnProxy;

			throw new Error("[node-rules-system] The script does not have access to process." + el + "!\n"
				+ "NativePath: " + nativePath + "\n"
				+ "WrapPath: " + wrapPath);

		}

		$process[el] = process[el];

		process[el] = function (module) {

			const callerPaths = getCallerPaths();

			if (!callerPaths) return blockedReturn();

			const [nativePath, wrapPath] = callerPaths;

			for (let i = 0; i < whiteList.length; ++i) {

				if (
					nativePath.startsWith(whiteList[i][0])
					&&
					wrapPath.startsWith(whiteList[i][1])
				) {

					return $process[el](module);

				}

			}

			return blockedReturn();

		};

		if(el == "binding") $process.statusBinding = true;
		else if(el == "_linkedBinding") $process.statusLinkedBinding = true;

		return true;

	};

});

module.exports = block;