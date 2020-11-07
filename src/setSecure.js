const { password, needToSetPassword, wrongPass } = require("./password");

const { wrongPassEmitter } = require("./logs");

module.exports = function makeSetSecure (
	connections, fs,
	process, child_process, dgram, worker_threads, cluster
) {

	return function setSecure(tryPass, status, secureElements) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "setSecure", { status, secureElements });

		if(!Array.isArray(secureElements)) secureElements = [];

		const elements = [];

		for(let i = 0; i < secureElements.length; ++i) {

			if(typeof secureElements[i] == "string") {

				elements.push(secureElements[i]);

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
				else return null;

			})();

			if(method == null) {

				results.push(null);

				continue;

			}

			const action = status == "enable" ? "block" : "allow";

			results.push( method[action](tryPass) );

		}

		return results;

	}

};