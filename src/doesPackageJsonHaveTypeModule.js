const nodePath = require("path");
const { existsSync } = require("fs");

let { $corePath, findCorePath } = require("./whiteListFunctionality");

if(!$corePath) $corePath = findCorePath();

module.exports = function () {

	const packagePath = nodePath.join($corePath, "./package.json");

	if ( !existsSync(packagePath) ) return false;

	const packageData = require(packagePath);

	return packageData.type == "module";

}