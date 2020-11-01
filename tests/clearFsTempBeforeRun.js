const { readdirSync } = require("fs");
const nodePath = require("path");

const dirs = [

	"./fsTemp/blocked",
	"./fsTemp/allowed",

];

module.exports = (unlinkSync) => {

	return (function clearDirectory () {

		if(!dirs.length) return true;

		const directory = nodePath.join(__dirname, dirs.shift());

		const files = readdirSync(directory);

		for (const file of files) {

			if(file == ".gitignore") continue;

			unlinkSync(
				nodePath.join(directory, file)
			);

		}

		return clearDirectory();

	})()

}