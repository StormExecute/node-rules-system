const isObject = require("../../dependencies/isObject");

const tls = require('tls');
const net = require("net");
const http = require("http");
const http2 = require("http2");
const https = require("https");

const checkAccess = require("./checkAccess");

const getCallerPaths = require("../getCallerPaths");
const getCallerFnName = require("../getCallerFnName");

const returnProxy = require("../returnProxy");

const debug = require("../_debug");

const { logsEmitter } = require("../logs");

function integrateToFns(whiteList, fnArray, origin, backup, allowList, fullBlock) {

	allowList = allowList || [];

	fnArray.forEach(el => {

		backup[el] = origin[el];

		origin[el] = function () {

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths.length) {

				logsEmitter("callFn", [], {

					grantRights: false,

					fn: el,
					args: arguments,

					calledAsClass: !!(new.target),

				});

				debug.integrate("toFns->false", callerPaths, el);

				return returnProxy;

			}

			debug.integrate("toFns->true", el, callerPaths);

			if(~allowList.indexOf(callerPaths[0])) {

				//dont emit

				return new.target ? new backup[el](...arguments) : backup[el].apply(this, arguments);

			}

			for(let i = 0; i < whiteList.length; ++i) {

				const {

					customHandler,

				} = whiteList[i];

				let access = false;

				if(typeof customHandler == "function") {

					access = !!customHandler("callFn", {

						callerPaths,
						callerFnName: getCallerFnName(),

						args: arguments,

						origin,
						method: el,

					});

				} else {

					const {

						whiteListDomains,
						blackListDomains,

					} = whiteList[i];

					const wLD = (whiteListDomains && whiteListDomains.length);
					const bLD = (blackListDomains && blackListDomains.length)

					if(
						wLD
						||
						bLD
					) {

						if(
							origin == http
							||
							origin == https
							||
							origin == http2
							||
							origin == net
							||
							origin == tls
						) {

							let url = null;

							if (
								(
									(origin == http || origin == https)
									&&
									(el == "request" || el == "get")
								)
								||
								(origin == http2 && el == "connect")
							) {

								url = isObject(arguments[0])
									? arguments[0].protocol + "//" + (arguments[0].host || arguments[0].hostname)
									: arguments[0];

							} else if(
								(origin == net && (el == "connect" || el == "createConnection"))
								||
								(origin == tls && el == "connect")
							) {

								url = isObject((arguments[0]))
									? arguments[0].host
									: arguments[1];

							}

							if(!url) continue;

							let skipByDomains = false;

							//wLD has more priorities than bLD
							if(wLD) {

								skipByDomains = true;

								for (let j = 0; j < whiteListDomains.length; ++j) {

									if(whiteListDomains[j] == url) {

										skipByDomains = false;

										break;

									}

								}

							} else {

								//bLD
								for (let j = 0; j < blackListDomains.length; ++j) {

									if(blackListDomains[j]) {

										skipByDomains = true;

										break;

									}

								}

							}

							if(skipByDomains) continue;

						}

					}

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

					logsEmitter("callFn", callerPaths, {

						grantRights: true,

						fn: el,
						args: arguments,

						calledAsClass: !!(new.target),

					});

					return new.target ? new backup[el](...arguments): backup[el].apply(this, arguments);

				}

			}

			logsEmitter("callFn", callerPaths, {

				grantRights: false,

				fn: el,
				args: arguments,

				calledAsClass: !!(new.target),

			});

			debug.integrate("toFns->", false);

			return returnProxy;

		};

	});

}

module.exports = integrateToFns;