const fs = require("fs");
const nodePath = require("path");

if(
	!fs.existsSync(
		nodePath.join( process.cwd(), "./package.json" )
	)
	||
	require(
		nodePath.join( process.cwd(), "./package.json" )
	).name != "node-rules-system"
) {

	throw new Error("This script should be run in the main project directory!");

}

const backupDirName = "backup";

const projectBDir = nodePath.join( process.cwd(), "./" + backupDirName + "/" );

function start(dir, nestedPaths) {

	nestedPaths = nestedPaths || "";

	const ls = fs.readdirSync(dir);

	for (let i = 0; i < ls.length; ++i) {

		const obj = ls[i];

		const path = nodePath.join(dir, obj);

		if( fs.lstatSync(path).isDirectory() ) {

			if(
				obj == "node_modules"
				||
				obj == ".git"
				||
				obj == ".idea"
				||
				obj == "dirty"
				||
				obj == "lib"
				||
				obj == "@types"
				||
				obj == backupDirName
			) {

				continue;

			}

			let bDir = nestedPaths;

			if(nestedPaths) {

				nestedPaths = nodePath.join( nestedPaths, "./" + obj );

			} else {

				nestedPaths = obj;

			}

			start(path, nestedPaths);

			nestedPaths = bDir;

		} else {

			if( obj.endsWith(".js") ) {

				const content = fs.readFileSync(path).toString();

				if( content.match ( /require\('.+?'/ ) ) {

					const newContent = content
						.replace( /require\('(.+?)'/g , 'require("$1"' );

					if(projectBDir) {

						fs.mkdirSync(
							nodePath.join( projectBDir, nestedPaths ),
							{ recursive: true }
						);

					}

					fs.writeFileSync(
						nodePath.join( projectBDir, nodePath.join( nestedPaths, "./" + obj ) ),
						content
					);

					fs.writeFileSync(path, newContent);

				}

			}

		}

	}

}

start(__dirname);