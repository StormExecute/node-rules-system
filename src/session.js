const { password, mustBeString } = require("./password");

const makeSession = function (connections) {

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

				$tls: { get(){} },
				$net: { get(){} },
				$http: { get(){} },
				$https: { get(){} },
				$http2: {get(){} },

				integrateToNet(){},
				integrateToHttp(){},
				integrateToHttps(){},
				integrateToHttp2(){},

				integrateToHttpAgent(){},
				integrateToHttpClient(){},
				integrateToTls(){},
				integrateToTlsWrap(){},

				restoreNet(){},
				restoreHttp(){},
				restoreHttps(){},
				restoreHttp2(){},

				restoreHttpAgent(){},
				restoreHttpClient(){},
				restoreTls(){},
				restoreTlsWrap(){},

				block(){},
				allow(){},

			},

		};

		const standartWrapper = function (fnProp, ...args) {

			if($sessionConfigs.returnSession) {

				connections[fnProp](password, ...args);

				return Object.assign({}, $session);

			} else {

				return connections[fnProp](password, ...args);

			}

		};

		const getWrapper = function (fnProp, propName) {

			if($sessionConfigs.returnSession) {

				connections[fnProp].get(password, propName);

				return Object.assign({}, $session);

			} else {

				return connections[fnProp].get(password, propName);

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

				return standartWrapper(fnProp, ...args);

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

					return getWrapper(fnProp, propName);

				}

			}

		});

		return Object.assign({}, $session);

	}

}

module.exports = makeSession;