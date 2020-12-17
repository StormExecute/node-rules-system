const { password, needToSetPassword, wrongPass } = require("./password");

const { ArrayIsArray } = require("./_data/primordials");

const { wrongPassEmitter } = require("./logs");

module.exports = function makeSetSecure (
	connections, fs,
	process, child_process, dgram, worker_threads, cluster,
	timers
) {

	function setSecure(tryPass, status, secureElements) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "setSecure", { status, secureElements });

		if(!ArrayIsArray(secureElements)) secureElements = [];

		const elements = [];

		for(let i = 0; i < secureElements.length; ++i) {

			if(typeof secureElements[i] == "string") {

				elements[elements.length] = secureElements[i];

			}

		}

		if(!elements.length) {

			return [

				false,
				false,

				false,

				false,
				false,
				false,
				false,

			];

		}

		status = status || "enable";

		const results = [];

		for(let i = 0; i < elements.length; ++i) {

			const el = elements[i];

			const method = (() => {

				if(el == "connections") return connections;
				else if(el == "fs") return fs;
				else if(el == "process") return process;
				else if(el == "child_process") return child_process;
				else if(el == "dgram") return dgram;
				else if(el == "worker_threads") return worker_threads;
				else if(el == "cluster") return cluster;
				else if(el == "timers") return timers;
				else return null;

			})();

			if(method == null) {

				results[ results.length ] = null;

				continue;

			}

			const action = status == "enable"
				? method == timers ? "integrate" : "block"
				: method == timers ? "restore" : "allow";

			results[ results.length ] = method[action](tryPass);

		}

		return results;

	}

	return {

		setSecure,

		setSecureEnable: function (tryPass, secureElements) {

			return setSecure(tryPass, "enable", secureElements);

		},

		setSecureDisable: function (tryPass, secureElements) {

			return setSecure(tryPass, "disable", secureElements);

		},

	}

};