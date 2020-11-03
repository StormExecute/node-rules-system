const { password, mustBeString, wrongPass } = require("./password");

const getCallerPaths = require("./getCallerPaths");

const { addProjectPathToWhiteList } = require("./whiteListFunctionality");

const makeSession = function (connections, fs, process) {

	const whiteList = [];

	return function session (password, ...args) {

		if(typeof password != "string") throw new Error(mustBeString);

		if(!password.value) {

			password.value = password;

		} else if(password != password.value) throw new Error(wrongPass);

		const whiteListResult = addProjectPathToWhiteList(whiteList, password, args);

		if(!whiteListResult) throw new Error("[node-rules-system] To create a secure session, you need to give it paths!");

		const $sessionConfigs = {

			returnSession: false,

		};

		const $session = {

			getConfigs(){},

			setReturn(newState){},

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

				blockBinding(options){},
				blockLinkedBinding(options){},

			},

		};

		const makeSecureWrapper = function (fn) {

			return function (...args) {

				const callerPaths = getCallerPaths();

				if (!callerPaths) return false;

				const [nativePath, wrapPath] = callerPaths;

				for (let i = 0; i < whiteList.length; ++i) {

					if (
						nativePath.startsWith(whiteList[i][0])
						&&
						wrapPath.startsWith(whiteList[i][1])
					) {

						return fn(...args);

					}

				}

				return false;

			};

		};

		const setSecureSessionProperty = function (prop, fn) {

			$session[prop] = makeSecureWrapper(fn);

		};

		setSecureSessionProperty("getConfigs", () => Object.assign({}, $sessionConfigs) );
		setSecureSessionProperty("setReturn", function (newState) {

			if (typeof newState != "boolean") return false;

			$sessionConfigs.returnSession = newState;

			return true;

		});

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

			$session.connections[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, connections, ...args);

			});

		});

		[

			"addFullPathToWhiteList",
			"addProjectPathToWhiteList",
			"addDependencyToWhiteList",
			"addDependencyPathToWhiteList",

			"block",
			"allow",

		].forEach(fnProp => {

			$session.fs[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, fs, ...args);

			});

		});

		[

			"blockBinding",
			"blockLinkedBinding",

		].forEach(fnProp => {

			$session.process[fnProp] = makeSecureWrapper(function (...args) {

				return standartWrapper(fnProp, process, ...args);

			});

		});

		[

			"$tls",
			"$net",
			"$http",
			"$https",
			"$http2",

		].forEach(fnProp => {

			$session.connections[fnProp] = {

				get: makeSecureWrapper(function (propName) {

					return getWrapper(fnProp, connections, propName);

				})

			};

		});

		[

			"$fs",
			"$fsPromises",

		].forEach(fnProp => {

			$session.fs[fnProp] = {

				get: makeSecureWrapper(function (propName) {

					return getWrapper(fnProp, fs, propName);

				})

			}

		});

		return Object.assign({}, $session);

	}

}

module.exports = makeSession;