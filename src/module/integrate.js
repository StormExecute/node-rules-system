const { password, needToSetPassword, wrongPass } = require("../password");
const { logsEmitter, wrongPassEmitter } = require("../logs");

const mRandom = require("../_data/random");

const Module = require('module');

const extendWrapStore = require("./extendWrapStore");
const $Module = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");
const integrateToProtoFn = require("../integrateFunctionality/toProtoFn");

const getCode = arr => arr.join("");
const randomSaltForVar = () => mRandom().toString().slice(2);

function secureRequirePatch(tryPass, whiteFilenames) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "useSecureRequirePatch");

	if($Module.status == true) return false;

	$Module.wrap = Module.wrap;

	const secureRequireSecretEmitter = "secureRequireSecretEmitter" + randomSaltForVar();

	$Module.secureRequireSecretEmitter = secureRequireSecretEmitter;

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

		const moduleWrapTemplate = "moduleWrap" + randomSaltForVar();
		const returnProxyTemplate = "returnProxy" + randomSaltForVar();

		const cloneFnTemplate = "cloneFn" + randomSaltForVar();
		const patchModuleTemplate = "patchModule" + randomSaltForVar();

		const whiteFilenamesParsedTemplate = whiteFilenamesParsed.length
			? "whiteFilenamesParsedTemplate" + randomSaltForVar()
			: "undefined";

const secureRequireTemplate = `
	const ${originRequire} = require;
	const ${originFilename} = __filename;
	
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
	
	const ${cloneFnTemplate} = function(fn) {
	
	    const that = fn;
	    
	    const temp = function temporary() { 
	        return !new.target ? that.apply(this, arguments) : new that(...arguments) 
	    };
	    
	    for(const key in fn) {
	    
	        if (fn.hasOwnProperty(key)) {
	        
	            temp[key] = fn[key];
	            
	        }
	        
	    }
	    
	    return temp;
	    
	};
	
	const ${patchModuleTemplate} = function(Module) {
	
		const store = {
			
			_extensionsJs: Module._extensions['.js'],
			
			protoLoad: Module.prototype.load,
		
		};
		
		["_load", "createRequireFromPath", "createRequire"].forEach(prop => {
		
			store[prop] = Module[prop];
		
			Module[prop] = function() {
			
				if(
					typeof ${whiteFilenamesParsedTemplate} != "undefined"
					&&
					~${whiteFilenamesParsedTemplate}.indexOf( ${originFilename} )
				) {
				
					return store[prop](...arguments);
				
				}
				
				return ${returnProxyTemplate};
			
			};
			
			Object.defineProperty(Module[prop], "toString", {
			
				value: () => "can't convert Module." + prop + " to string"
				
			});
		
		});
		
		Module._extensions['.js'] = function() {
		
			if(
				typeof ${whiteFilenamesParsedTemplate} != "undefined"
				&&
				~${whiteFilenamesParsedTemplate}.indexOf( ${originFilename} )
			) {
			
				return store._extensionsJs(...arguments);
			
			}
			
			return ${returnProxyTemplate};
		
		};
		
		Object.defineProperty(Module._extensions['.js'], "toString", {
		
			value: () => "can't convert Module._extensions['.js'] to string"
			
		});
		
		Module.prototype.load = function() {
		
			if(
				typeof ${whiteFilenamesParsedTemplate} != "undefined"
				&&
				~${whiteFilenamesParsedTemplate}.indexOf( ${originFilename} )
			) {
			
				return store.protoLoad.apply(this, arguments);
			
			}
			
			return ${returnProxyTemplate};
		
		};
		
		Object.defineProperty(Module.prototype.load, "toString", {
		
			value: () => "can't convert Module.prototype.load to string"
			
		});
		
		Module.Module = Module;
	
	};
	
	require = function(path) {
	
		if( ${moduleWrapTemplate} != ${originRequire}("module").wrap ) {
		
			if(
				typeof ${whiteFilenamesParsedTemplate} != "undefined"
				&&
				~${whiteFilenamesParsedTemplate}.indexOf( ${originFilename} )
			) {
			
				const result = ${originRequire}(path);
		
				if(result == ${originRequire}("module")) {
				
					const finalR = ${cloneFnTemplate}(result);
				
					${patchModuleTemplate}(finalR);
					
					return finalR;
				
				}
				
				return result;
			
			}
		
			${secureRequireSecretEmitter}( ${originFilename}, path, ${originRequire}("module").wrap );
		
			${originRequire}("module").wrap = ${moduleWrapTemplate};
		
		}
	
		//if require was called from node_modules
		if( ${originFilename}.includes("/node_modules") ) {
		
			const fastResolvePath = ${originRequire}.resolve( path );
			
			//if fastResolvePath doesn't extend beyond node_modules
			if(
				fastResolvePath.includes("/node_modules")
				||
				(
					typeof ${whiteFilenamesParsedTemplate} != "undefined"
					&&
					~${whiteFilenamesParsedTemplate}.indexOf( ${originFilename} )
				)
			) {
			
				const result = ${originRequire}(path);
		
				if(result == ${originRequire}("module")) {
				
					const finalR = ${cloneFnTemplate}(result);
				
					${patchModuleTemplate}(finalR);
					
					return finalR;
				
				}
				
				return result;
			
			}
			
			return ${returnProxyTemplate};
		
		}
	
		const result = ${originRequire}(path);
		
		if(result == ${originRequire}("module")) {
		
			const finalR = ${cloneFnTemplate}(result);
		
			${patchModuleTemplate}(finalR);
			
			return finalR;
		
		}
		
		return result;
	
	};
	
	for(const prop in ${originRequire}) {
	
		require[prop] = ${originRequire}[prop];
	
	}
	
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