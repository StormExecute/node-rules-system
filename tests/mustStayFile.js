const fs = require("fs");
const nodePath = require("path");

const path = nodePath.join(__dirname, "./fsTemp/mustStay.txt");

module.exports = function (writeFileSync) {

	writeFileSync(path, "This file was created for reading in ./blocked/* .\n" + "The original content should not be affected.");

};