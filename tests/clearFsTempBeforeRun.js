const { readdirSync, lstatSync } = require("fs");
const nodePath = require("path");

const dirs = [

	"./fsTemp/blocked",
	"./fsTemp/allowed",

];

module.exports = (unlinkSync, rmdirSync) => {

	return (function clearDirectory () {

		if(!dirs.length) return true;

		const directory = nodePath.join(__dirname, dirs.shift());

		const files = readdirSync(directory);

		for (const file of files) {

			if(file == ".gitignore") continue;

			const thisPath = nodePath.join(directory, file);

			if(lstatSync(thisPath).isDirectory()) {

				rmdirSync(thisPath);

			} else {

				unlinkSync(thisPath);

			}

		}

		return clearDirectory();

	})()

}