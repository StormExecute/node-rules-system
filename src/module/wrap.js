const settings = require("../_settings/store");

const {

	ReflectApply,

	ArrayForEach,
	ArrayIndexOf,

	String,
	StringSlice,
	StringMatch,
	StringReplace,

	ObjectDefineProperty,

	SetTimeout,
	ClearTimeout,

	MathRandom,

} = require("../_data/primordials");

const { logsEmitter } = require("../logs")

const { parseRandomInCodeMatch } = require("../_data");

const Module = require('module');

const wrapStore = require("./wrapStore");
const extendWrapStore = require("./extendWrapStore");
const $Module = require("./store");

const setSecureRequireToModule = require("./setSecureRequirePatch");
const setDependencyController = require("./setDependencyController");

const getRandomSaltForVar = () => StringSlice(String(MathRandom()), 2);

let randomSign = getRandomSaltForVar() + getRandomSaltForVar();

const changeRandomSign = newValue => {

	if(randomSign == newValue) {

		return changeRandomSign( getRandomSaltForVar() + getRandomSaltForVar() );

	} else {

		return randomSign = newValue;

	}

};

wrapStore.utils = "wrapUtils" + randomSign;
wrapStore.dRules = "dependencyControllerRules" + randomSign;

//usually
wrapStore.u = {

	requireOrigin: "requireOrigin" + randomSign,

	originFilename: "originFilename" + randomSign,
	returnProxyTemplate: "returnProxyTemplate" + randomSign,

};

const randomSignChanger = (immediately, sysImmediately) => {

	if(immediately) {

		ClearTimeout(randomSignChanger.timeout);
		randomSignChanger.timeout = null;

	}

	if(
		settings.changeModuleRandomSignInterval
		&&
		$Module.statusPatchWrap
	) {

		if(!sysImmediately && randomSignChanger.timeout) return false;

		return randomSignChanger.timeout = SetTimeout(() => {

			changeRandomSign( getRandomSaltForVar() + getRandomSaltForVar() );

			for(const prop in wrapStore.u) {

				wrapStore.u[prop] = prop + randomSign;

			}

			if( global[ wrapStore.utils ] ) {

				delete global[ wrapStore.utils ];

				wrapStore.utils = "wrapUtils" + randomSign;

				setGlobalWrapUtils();

			}

			if( global[ wrapStore.dRules ] ) {

				const argsObject = global[ wrapStore.dRules ];

				delete global[ wrapStore.dRules ];

				wrapStore.dRules = "dependencyControllerRules" + randomSign;

				setGlobalDrules(argsObject);

			} else {

				wrapStore.dRules = "dependencyControllerRules" + randomSign;

			}

			parentRequire = makeParentRequire();

			if($Module.statusSecureRequire == true) setSecureRequireToModule();
			if($Module.statusDependencyController == true) setDependencyController();

			randomSignChanger(false, true);

		}, settings.changeModuleRandomSignInterval)

	}

	return false;

};

const makeParentRequire = () => `
	const ${ wrapStore.u.requireOrigin } = require;
	const ${ wrapStore.u.requireResolve } = require.resolve;
	const ${ wrapStore.u.originFilename } = __filename;
	
	const ${ wrapStore.u.returnProxyTemplate } = 
		new ${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].Proxy(class {}, {
		
			get: (_, prop) => {
				
				if(prop == Symbol.toPrimitive) {
				
					return () => "0"
				
				} else {
				
					return ${ wrapStore.u.returnProxyTemplate };
				
				}
				
			},
			has: () => ${ wrapStore.u.returnProxyTemplate },
			deleteProperty: () => ${ wrapStore.u.returnProxyTemplate },
			apply: () => ${ wrapStore.u.returnProxyTemplate },
			construct: () => ${ wrapStore.u.returnProxyTemplate },
			
		});
	
	const ___NRS_SECURE_IS_RETURN_PROXY = function(argument) {
	
		return argument === ${ wrapStore.u.returnProxyTemplate };
	
	};
	
	${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].ObjectDefineProperty(
		___NRS_SECURE_IS_RETURN_PROXY, "toString", {
		
			value: () => "can't convert ___NRS_SECURE_IS_RETURN_PROXY to string"
			
		}
	);

	require = function(path) {
	
		const result = ${ wrapStore.u.requireOrigin }(path);
		
		if(result == ${ wrapStore.u.requireOrigin }("module")) {
		
			return global[ "${ wrapStore.utils }" ].patchModule(
			
				${ wrapStore.u.returnProxyTemplate },
				${ wrapStore.u.originFilename },
				${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].cloneFn( result )
			
			);
		
		}
		
		return result;
	
	};
	
	for(const prop in ${ wrapStore.u.requireOrigin }) {
	
		require[prop] = ${ wrapStore.u.requireOrigin }[prop];
	
	}
	
	${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].ObjectDefineProperty(
		require, "toString", {
		
			value: () => "can't convert require to string"
			
		}
	);
`;

let parentRequire = makeParentRequire();

const parseRandomInCode = code => {

	let matchI = 0;
	let startMatchI = 0;

	let inEscaping = false;

	let inQuotes = 0;
	let inBackQuotes = false;

	for (let i = 0; i < code.length; ++i) {

		const thSym = code[i];

		if(inEscaping) {

			inEscaping = false;

			continue;

		}

		// \" \'
		if(

			thSym == "\\"
			&&
			inQuotes
			&&
			( (i + 1) < code.length )
			&&
			(
				code[i + 1] == "'"
				||
				code[i + 1] == '"'
			)

		) {

			inEscaping = true;

		} else if(

			//end of quote

			(thSym == '"' && inQuotes == 1)
			||
			(thSym == "'" && inQuotes == 2)

		) {

			inQuotes = 0;

		} else if(thSym == '"' && !inQuotes && !inBackQuotes) {

			inQuotes = 1;

		} else if(thSym == "'" && !inQuotes && !inBackQuotes) {

			inQuotes = 2;

		} else if(thSym == "`" && !inQuotes) {

			inBackQuotes = !inBackQuotes;

		} else if(thSym == parseRandomInCodeMatch[matchI] && !inQuotes && !inBackQuotes) {

			if( (matchI + 1) == parseRandomInCodeMatch.length ) {

				//startMatchI as startI
				//i as endI

				code =
					StringSlice(code, 0, startMatchI)
					+ randomSign
					+ StringSlice(code, i + 1);

				i = startMatchI - 1 + randomSign.length;

			} else {

				if(!startMatchI) startMatchI = i;

				++matchI;

				continue;

			}

		}

		startMatchI = 0;
		matchI = 0;

	}

	return code;

};

const getCode = arr => {

	let result = "";

	for (let i = 0; i < arr.length; ++i) {

		//const [id, code] = arr[i];

		result += parseRandomInCode( arr[i][1] );

	}

	return result;

};

const simpleGetCode = arr => {

	let result = "";

	for (let i = 0; i < arr.length; ++i) {

		result += parseRandomInCode( arr[i] );

	}

	return result;

};

const setGlobalWrapUtils = () => {

	ObjectDefineProperty(global, wrapStore.utils, {

		configurable: true,
		writable: true,

		enumerable: false,

		value: {

			patchModule: function (returnProxy, filename, ModuleCopy) {

				ArrayForEach(["_load", "createRequireFromPath", "createRequire"], prop => {

					ModuleCopy[prop] = function() {

						if( ~ArrayIndexOf( extendWrapStore.whiteFilenamesForWrap, filename ) ) {

							logsEmitter("useModuleFns", null, {

								grantRights: true,
								type: "Module." + prop,
								args: arguments

							});

							return Module[prop](...arguments);

						}

						logsEmitter("useModuleFns", null, {

							grantRights: false,
							type: "Module." + prop,
							args: arguments

						});

						return returnProxy;

					};

				});

				ModuleCopy["_extensions"]['.js'] = function() {

					if( ~ArrayIndexOf( extendWrapStore.whiteFilenamesForWrap, filename ) ) {

						logsEmitter("useModuleFns", null, {

							grantRights: true,
							type: "Module._extensions['.js']",
							args: arguments

						});

						return Module["_extensions"]['.js'](...arguments);

					}

					logsEmitter("useModuleFns", null, {

						grantRights: false,
						type: "Module._extensions['.js']",
						args: arguments

					});

					return returnProxy;

				};

				ModuleCopy.prototype.load = function() {

					if( ~ArrayIndexOf( extendWrapStore.whiteFilenamesForWrap, filename ) ) {

						logsEmitter("useModuleFns", null, {

							grantRights: true,
							type: "Module.prototype.load",
							args: arguments

						});

						return ReflectApply(Module.prototype.load, Module, arguments);

					}

					logsEmitter("useModuleFns", null, {

						grantRights: false,
						type: "Module.prototype.load",
						args: arguments

					});

					return returnProxy;

				};

				let wrap = ModuleCopy.wrap;

				ObjectDefineProperty(ModuleCopy, "wrap", {

					set(value) {

						if( !~ArrayIndexOf( extendWrapStore.whiteFilenamesForWrap, filename ) ) {

							logsEmitter("upModuleWrap", null, {

								grantRights: false,

								type: "change",

								filename,
								value,

							});

							return false;

						}

						if(typeof value != "function") return false;

						let v = value();

						if(typeof v != "string") return false;

						const haveWrapper = StringMatch( v, /\n}\);$/ );

						const haveStandardWrapper = StringMatch(v,
							/^\(function \(exports, require, module, __filename, __dirname\) { /
						);

						if(haveWrapper && haveStandardWrapper) {

							v = StringReplace(v,
								/^\(function \(exports, require, module, __filename, __dirname\) { /, ""
							);
							v = StringReplace(v, /\n}\);$/, "");

						} else if(haveWrapper) {

							return false;

						}

						extendWrapStore.customCode[ extendWrapStore.customCode.length] = v;
						wrap = value;

						logsEmitter("upModuleWrap", null, {

							grantRights: true,

							type: "change",

							filename,
							value,

						});

						return true;

					},

					get() {

						return wrap;

					}

				});

				ModuleCopy.wrap.NRS_ADD_CUSTOM_CODE = function (code) {

					if( ~ArrayIndexOf( extendWrapStore.whiteFilenamesForWrap, filename ) ) {

						extendWrapStore.customCode[ extendWrapStore.customCode.length] = code;

						logsEmitter("upModuleWrap", null, {

							grantRights: true,

							type: "customCode",

							filename,
							value: code,

						});

						return true;

					}

					return false;

				};

				ModuleCopy.Module = ModuleCopy;

			},

		}

	});

	return true;

};

const setGlobalDrules = argsObject => {

	ObjectDefineProperty(global, wrapStore.dRules, {

		configurable: true,
		writable: true,

		enumerable: false,

		//link, can change
		value: argsObject

	});

};

const patchWrap = () => {

	//check statusPatchWrap before calling this function
	//if($Module.statusPatchWrap == true) return false;

	setGlobalWrapUtils();

	$Module.wrap = Module.wrap;

	Module.wrap = function (script) {

		return getCode(extendWrapStore.beforeWrapper)
			+ extendWrapStore.wrapper[0]
			+ getCode(extendWrapStore.beforeSecureRequire)
			+ parentRequire
			+ ($Module.statusSecureRequire ? parseRandomInCode( $Module.secureRequire ) : "")
			+ ($Module.statusDependencyController ? parseRandomInCode( $Module.dependencyController ) : "")
			+ getCode(extendWrapStore.beforeMainCode)
			+ simpleGetCode(extendWrapStore.customCode)
			+ script
			+ getCode(extendWrapStore.afterMainCode)
			+ extendWrapStore.wrapper[1]
			+ getCode(extendWrapStore.afterWrapper);

	};

	$Module.statusPatchWrap = true;

};

module.exports = {

	wrapStore,

	setGlobalDrules,

	randomSignChanger,

	patchWrap,

};