const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const mRandom = require("../_data/random");

const Module = require('module');

const randomSaltForVar = () => mRandom().toString().slice(2);

function enableSecureRequire(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "enableSecureRequire");

	Module.wrap = function(script) {

		const originRequire = "originRequire" + randomSaltForVar();
		const originFilename = "originFilename" + randomSaltForVar();
		const nodePathTemplate = "nodePath" + randomSaltForVar();
		const returnProxyTemplate = "returnProxy" + randomSaltForVar();

const secureRequireTemplate = `
	const ${originRequire} = require;
	const ${originFilename} = __filename;
	const ${nodePathTemplate} = require("path");
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
		
	});
	
	require = function(path) {
	
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

		return '(function (exports, require, module, __filename, __dirname) { '
			+ secureRequireTemplate
			+ script
			+ '\n});';

	};

}

module.exports = enableSecureRequire;