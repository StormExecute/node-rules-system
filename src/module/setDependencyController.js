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
	
		for(let i = 0; i < ${ wrapStore.u.originFilename }.length; ++i) {
		
			const thSym = ${ wrapStore.u.originFilename }[i];
			
			if(inProcessGetDName) {
			
				if(thSym == "/" || thSym == "\\\\") {
				
					inProcessGetDName = false;
				
				} else {
				
					result += thSym;
				
				}
			
			} else {
				
				if(
					thSym == match[matchI]
					||
					(
						(matchI + 1) == match.length
						&&
						thSym == "\\\\"
					)
				) {
				
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
			
			if( 
				~${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].ArrayIndexOf(
					${ wrapStore.u.requireOrigin }("module").builtinModules,
					path
				)
			) {
			
				return ${originalRequire}(path);
			
			}
			
			if(
				${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].StringMatch(
					path,
					/^[^._][a-zA-Z0-9._-]+$|^[a-zA-Z0-9-]$/
				)
				&&
				global[ "${ wrapStore.dRules }" ][ ${dependencyName} ]
			) {
			
				const paths = ${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].ArrayIsArray(
					global[ "${ wrapStore.dRules }" ][ ${dependencyName} ]
				)
					? global[ "${ wrapStore.dRules }" ][ ${dependencyName} ]
					: [ global[ "${ wrapStore.dRules }" ][ ${dependencyName} ] ];
					
				for(let i = 0; i < paths.length; ++i) {
				
					if( paths[i] == "<ownDependencies>" || paths[i] == "<ownDevDependencies>" ) {
					
						const dependencyCorePath = global[ "${ wrapStore.utils }" ].findCorePath(
							${ wrapStore.u.originFilename }
						);
						
						if(
							dependencyCorePath != process.cwd()
							&&
							(
								${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].StringIncludes(
									dependencyCorePath,
									"/node_modules/"
								)
								||
								${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].StringIncludes(
									dependencyCorePath,
									"\\\\node_modules\\\\"
								)
							)
						) {
						
							const packageJson = ${ wrapStore.u.requireOrigin }(
								${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].nodePathJoin(
									dependencyCorePath,
									"package.json"
								)
							);
							
							if( paths[i] == "<ownDependencies>" ) {
							
								if( packageJson.dependencies ) {
								
									for(const dep in packageJson.dependencies) {
									
										paths[ paths.length ] = dep;
									
									}
								
								}
							
							} else {
							
								if( packageJson.devDependencies ) {
								
									for(const dep in packageJson.devDependencies) {
									
										paths[ paths.length ] = dep;
									
									}
								
								}
							
							}
						
						}
					
					} else if( paths[i] == path ) {
					
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