const { JSONStringify } = require("../_data/primordials");

const $Module = require("./store");

const wrapStore = require("./wrapStore");

const originRequire = "originRequire[[NRS_RANDOM_FN_SALT]]";

const setSecureRequirePatch = whiteFilenamesParsed => {

	if(!whiteFilenamesParsed && !$Module.secureRequireArgsLink) return false;

	if(!whiteFilenamesParsed) {

		whiteFilenamesParsed = $Module.secureRequireArgsLink;

	} else if(!$Module.secureRequireArgsLink) {

		$Module.secureRequireArgsLink = whiteFilenamesParsed;

	}

	const whiteFilenamesParsedTemplate = whiteFilenamesParsed.length
		? "whiteFilenamesParsedTemplate[[NRS_RANDOM_FN_SALT]]"
		: "undefined";

$Module.secureRequire = `
	const ${originRequire} = require;${!whiteFilenamesParsed.length ? "" : `
	
	const ${whiteFilenamesParsedTemplate} = ${ JSONStringify( whiteFilenamesParsed ) }
	
`}
	
	require = function(path) {
	
		if(typeof path != "string") return ${originRequire}(path);
	
		if( 
				~${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].ArrayIndexOf(
					${ wrapStore.u.requireOrigin }("module").builtinModules,
					path
				)
			) {
			
				return ${originRequire}(path);
			
			}
	
		//if require was called from node_modules
		if( 
			${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].StringIncludes(
				${ wrapStore.u.originFilename },
				"/node_modules"
			)
		) {
		
			const fastResolvePath = ${ wrapStore.u.requireResolve }( path );
			
			//NOTE: DO NOT USE COMMENTS WITH QUOTES, BECAUSE THIS VIOLATES PARSING IN parseRandomInCode.
			//ALSO: DO NOT ADD WAYS TO FIX THIS FEATURE, AS THIS WILL AFFECT THE PARSING SPEED.
			//if fastResolvePath doesnt extend beyond node_modules
			if(
				${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].StringIncludes(
					fastResolvePath,
					"/node_modules"
				)
				||
				(
					typeof ${whiteFilenamesParsedTemplate} != "undefined"
					&&
					~${ wrapStore.u.requireOrigin }("http")["NRS_PRIMORDIALS"].ArrayIndexOf(
						${whiteFilenamesParsedTemplate},
						${ wrapStore.u.originFilename } 
					)
				)
			) {
			
				return ${originRequire}(path);
			
			}
			
			return ${ wrapStore.u.returnProxyTemplate };
		
		}
	
		return ${originRequire}(path);
	
	};
`;

	return true;

};

module.exports = setSecureRequirePatch;