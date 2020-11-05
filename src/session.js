const { password, mustBeString } = require("./password");

const makeSession = function (connections, fs, process, child_process, dgram, worker_threads) {

	return function session (password) {

		if(typeof password != "string") throw new Error(mustBeString);

		if(!password.value) {

			password.value = password;

		}

		const $sessionConfigs = {

			returnSession: false,

		};

		const $session = {

			getConfigs() {

				return Object.assign({}, $sessionConfigs);

			},

			setReturn(newState) {

				if(typeof newState != "boolean") return false;

				$sessionConfigs.returnSession = newState;

				return true;

			},

			connections: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$tls: { get(propName){} },
				$net: { get(propName){} },
				$http: { get(propName){} },
				$https: { get(propName){} },
				$http2: { get(propName){} },

				integrateToNet(fullBlock){},
				integrateToHttp(fullBlock){},
				integrateToHttps(fullBlock){},
				integrateToHttp2(fullBlock){},

				integrateToHttpAgent(fullBlock){},
				integrateToHttpClient(fullBlock){},
				integrateToTls(fullBlock){},
				integrateToTlsWrap(fullBlock){},

				restoreNet(fullBlock){},
				restoreHttp(fullBlock){},
				restoreHttps(fullBlock){},
				restoreHttp2(fullBlock){},

				restoreHttpAgent(fullBlock){},
				restoreHttpClient(fullBlock){},
				restoreTls(fullBlock){},
				restoreTlsWrap(fullBlock){},

				block(fullBlock){},
				allow(fullBlock){},

			},

			fs: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fs: { $get(propName){} },
				$fsPromises: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			process: {

				$fns: { $get(propName){} },

				blockBinding(options){},
				blockLinkedBinding(options){},
				blockDlopen(options){},

				blockBindingLinkedBindingAndDlopen(options){},

				allowBinding(options){},
				allowLinkedBinding(options){},
				allowDlopen(options){},

				allowBindingLinkedBindingAndDlopen(options){},

			},

			child_process: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			dgram: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

			worker_threads: {

				addFullPathToWhiteList(...args){},
				addProjectPathToWhiteList(...args){},
				addDependencyToWhiteList(...args){},
				addDependencyPathToWhiteList(...args){},

				$fns: { $get(propName){} },

				block(fullBlock){},
				allow(fullBlock){},

			},

		};

		const standartWrapper = function (fnProp, factory, ...args) {

			if($sessionConfigs.returnSession) {

				factory[fnProp](password, ...args);

				return Object.assign({}, $session);

			} else {

				return factory[fnProp](password, ...args);

			}

		};

		const getWrapper = function (fnProp, factory, propName) {

			if($sessionConfigs.returnSession) {

				factory[fnProp].get(password, propName);

				return Object.assign({}, $session);

			} else {

				return factory[fnProp].get(password, propName);

			}

		};

		[

			"addFullPathToWhiteList",
			"addProjectPathToWhiteList",
			"addDependencyToWhiteList",
			"addDependencyPathToWhiteList",

			"integrateToNet",
			"integrateToHttp",
			"integrateToHttps",
			"integrateToHttp2",

			"integrateToHttpAgent",
			"integrateToHttpClient",
			"integrateToTls",
			"integrateToTlsWrap",

			"restoreNet",
			"restoreHttp",
			"restoreHttps",
			"restoreHttp2",

			"restoreHttpAgent",
			"restoreHttpClient",
			"restoreTls",
			"restoreTlsWrap",

			"block",
			"allow",

		].forEach(fnProp => {

			$session.connections[fnProp] = function (...args) {

				return standartWrapper(fnProp, connections, ...args);

			}

		});

		[

			"addFullPathToWhiteList",
			"addProjectPathToWhiteList",
			"addDependencyToWhiteList",
			"addDependencyPathToWhiteList",

			"block",
			"allow",

		].forEach(fnProp => {

			$session.fs[fnProp] = function (...args) {

				return standartWrapper(fnProp, fs, ...args);

			}

		});

		[

			"blockBinding",
			"blockLinkedBinding",
			"blockDlopen",

			"blockBindingLinkedBindingAndDlopen",

			"allowBinding",
			"allowLinkedBinding",
			"allowDlopen",

			"allowBindingLinkedBindingAndDlopen",

		].forEach(fnProp => {

			$session.process[fnProp] = function (...args) {

				return standartWrapper(fnProp, process, ...args);

			}

		});

		[

			"addFullPathToWhiteList",
			"addProjectPathToWhiteList",
			"addDependencyToWhiteList",
			"addDependencyPathToWhiteList",

			"block",
			"allow",

		].forEach(fnProp => {

			$session.child_process[fnProp] = function (...args) {

				return standartWrapper(fnProp, child_process, ...args);

			}

		});

		[

			"addFullPathToWhiteList",
			"addProjectPathToWhiteList",
			"addDependencyToWhiteList",
			"addDependencyPathToWhiteList",

			"block",
			"allow",

		].forEach(fnProp => {

			$session.dgram[fnProp] = function (...args) {

				return standartWrapper(fnProp, dgram, ...args);

			}

		});

		[

			"addFullPathToWhiteList",
			"addProjectPathToWhiteList",
			"addDependencyToWhiteList",
			"addDependencyPathToWhiteList",

			"block",
			"allow",

		].forEach(fnProp => {

			$session.worker_threads[fnProp] = function (...args) {

				return standartWrapper(fnProp, worker_threads, ...args);

			}

		});

		[

			"$tls",
			"$net",
			"$http",
			"$https",
			"$http2",

		].forEach(fnProp => {

			$session.connections[fnProp] = {

				get: function (propName) {

					return getWrapper(fnProp, connections, propName);

				}

			}

		});

		[

			"$fs",
			"$fsPromises",

		].forEach(fnProp => {

			$session.fs[fnProp] = {

				get: function (propName) {

					return getWrapper(fnProp, fs, propName);

				}

			}

		});

		$session.process.$fns = {

			get: function (propName) {

				return getWrapper("$fns", process, propName);

			}

		};

		$session.child_process.$fns = {

			get: function (propName) {

				return getWrapper("$fns", child_process, propName);

			}

		};

		$session.dgram.$fns = {

			get: function (propName) {

				return getWrapper("$fns", dgram, propName);

			}

		};

		$session.worker_threads.$fns = {

			get: function (propName) {

				return getWrapper("$fns", worker_threads, propName);

			}

		};

		return Object.assign({}, $session);

	}

}

module.exports = makeSession;