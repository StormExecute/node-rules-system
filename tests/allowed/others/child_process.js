const { exec } = require('child_process');
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = exec("node " + nodePath.join(__dirname, "../../middle/bySpawn.js"), (error, stdout, stderr) => {

	process.thenTest(true);

});

if(test === returnProxy) process.thenTest("must be allowed!");