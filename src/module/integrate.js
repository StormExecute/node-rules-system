const { password, needToSetPassword, wrongPass } = require("../password");
const { logsEmitter, wrongPassEmitter } = require("../logs");
const getCallerFilename = require("../getCallerFilename");

const mRandom = require("../_data/random");

const { whiteList } = require("./addToWhiteList");

const Module = require('module');

const extendWrapStore = require("./extendWrapStore");
const $Module = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");
const integrateToProtoFn = require("../integrateFunctionality/toProtoFn");

const getCode = arr => arr.join("");
const randomSaltForVar = () => mRandom().toString().slice(2);

function secureRequirePatch(tryPass, fullBlock, whiteFilenames) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "enableSecureRequire");

	if($Module.status == true) return false;

	$Module.wrap = Module.wrap;

	const secureRequireSecretEmitter = "secureRequireSecretEmitter" + randomSaltForVar();

	Object.defineProperty(global, secureRequireSecretEmitter, {

		configurable: true,
		writable: true,

		enumerable: false,

		value: function (filename, path, failedWrapper) {

			logsEmitter("attempToChangeModuleWrap", null, { filename, path, failedWrapper });

		}

	});

	const whiteFilenamesParsed = typeof whiteFilenames == "string" ? [whiteFilenames] : [];

	if(!whiteFilenamesParsed.length && Array.isArray(whiteFilenames)) {

		for (let i = 0; i < whiteFilenames.length; ++i) {

			if(typeof whiteFilenames[i] == "string") {

				whiteFilenamesParsed.push( whiteFilenames[i] );

			}

		}

	}

	Module.wrap = function wrap(script) {

		const originRequire = "originRequire" + randomSaltForVar();
		const originFilename = "originFilename" + randomSaltForVar();

		const nodePathTemplate = "nodePath" + randomSaltForVar();
		const moduleWrapTemplate = "moduleWrap" + randomSaltForVar();

		const returnProxyTemplate = "returnProxy" + randomSaltForVar();
		const whiteFilenamesParsedTemplate = whiteFilenamesParsed.length
			? "whiteFilenamesParsedTemplate" + randomSaltForVar()
			: "undefined";

const secureRequireTemplate = `
	const ${originRequire} = require;
	const ${originFilename} = __filename;
	
	const ${nodePathTemplate} = require("path");
	const ${moduleWrapTemplate} = require("module").wrap;
	
	const ${returnProxyTemplate} = new Proxy(class {}, {
	
		get: (_, prop) => {
			
			if(prop == Symbol.toPrimitive) {
			
				return () => "0"
			
			} else {
			
				return ${returnProxyTemplate};
			
			}
			
		},
		has: () => ${returnProxyTemplate},
		deleteProperty: () => ${returnProxyTemplate},
		apply: () => ${returnProxyTemplate},
		construct: () => ${returnProxyTemplate},
		
	});${!whiteFilenamesParsed.length ? "" : `
	
	const ${whiteFilenamesParsedTemplate} = ${JSON.stringify( whiteFilenamesParsed )}
	
`}

	const ___NRS_SECURE_IS_RETURN_PROXY = function(argument) {
	
		return argument === ${returnProxyTemplate};
	
	};
	
	Object.defineProperty(___NRS_SECURE_IS_RETURN_PROXY, "toString", {
	
		value: () => "can't convert ___NRS_SECURE_IS_RETURN_PROXY to string"
		
	});
	
	require = function(path) {
	
		if( ${moduleWrapTemplate} != ${originRequire}("module").wrap ) {
		
			if(
				typeof ${whiteFilenamesParsedTemplate} != "undefined"
				&&
				~${whiteFilenamesParsedTemplate}.indexOf( ${originFilename} )
			) {
			
				return ${originRequire}(path);
			
			}
		
			${secureRequireSecretEmitter}( ${originFilename}, path, ${originRequire}("module").wrap );
		
			${originRequire}("module").wrap = ${moduleWrapTemplate};
		
		}
	
		//if require was called from node_modules
		if( ${originFilename}.includes("/node_modules") ) {
		
			const fastResolvePath = ${nodePathTemplate}.join( ${originFilename} , path );
			
			//if fastResolvePath doesn't extend beyond node_modules
			if( fastResolvePath.includes("/node_modules") ) {
			
				return ${originRequire}(path);
			
			}
			
			return ${returnProxyTemplate};
		
		}
	
		return ${originRequire}(path);
	
	};
	
	Object.defineProperty(require, "toString", { value: () => "can't convert require to string" })
`;

		return getCode(extendWrapStore.beforeWrapper)
			+ extendWrapStore.wrapper[0]
			+ getCode(extendWrapStore.beforeSecureRequire)
			+ secureRequireTemplate
			+ getCode(extendWrapStore.beforeMainCode)
			+ script
			+ getCode(extendWrapStore.afterMainCode)
			+ extendWrapStore.wrapper[1]
			+ getCode(extendWrapStore.afterWrapper);

	};

	return $Module.status = true;

}

module.exports = secureRequirePatch;