const $Module = require("./store");

const wrapStore = require("./wrapStore");

const originalRequire = "originalRequire[[NRS_RANDOM_FN_SALT]]";
const dependencyName = "dependencyName[[NRS_RANDOM_FN_SALT]]";

const setDependencyController = () => {

$Module.dependencyController = `
	const ${originalRequire} = require;
	
	const ${dependencyName} = (function() {
	
		const match = "node_modules/";
		let matchI = 0;
		
		let inProcessGetDName = false;
	
		let result = "";
	
		for(let i = 0; i < __filename.length; ++i) {
		
			const thSym = __filename[i];
			
			if(inProcessGetDName) {
			
				if(thSym == "/") {
				
					inProcessGetDName = false;
				
				} else {
				
					result += thSym;
				
				}
			
			} else {
				
				if(thSym == match[matchI]) {
				
					if( (matchI + 1) == match.length ) {
					
						result = "";
					
						inProcessGetDName = true;
					
					} else {
					
						++matchI;
						
						continue;
					
					}
				
				}
				
				matchI = 0;
				
			}
		
		}
		
		return result;
	
	})();
	
	if( ${dependencyName} ) {

		require = function(path) {
		
			if(typeof path != "string") return ${originalRequire}(path);
			
			if( ~${ wrapStore.u.requireOrigin }("module").builtinModules.indexOf(path) ) {
			
				return ${originalRequire}(path);
			
			}
			
			if(
				path.match( /^[^._][a-zA-Z0-9._-]+$|^[a-zA-Z0-9-]$/ )
				&&
				global[ "${ wrapStore.dRules }" ][ ${dependencyName} ]
			) {
			
				const paths = ${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].ArrayIsArray(
					global[ "${ wrapStore.dRules }" ][ ${dependencyName} ]
				)
					? global[ "${ wrapStore.dRules }" ][ ${dependencyName} ]
					: [ global[ "${ wrapStore.dRules }" ][ ${dependencyName} ] ];
					
				for(let i = 0; i < paths.length; ++i) {
				
					if( paths[i] == path ) {
					
						return ${originalRequire}(path);
					
					}
				
				}
				
				return ${ wrapStore.u.returnProxyTemplate };
			
			}
			
			return ${originalRequire}(path);
		
		};
	
	}
`;

	return true;

};

module.exports = setDependencyController;