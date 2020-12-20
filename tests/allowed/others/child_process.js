const { exec } = require("child_process");
const nodePath = require("path");

const test = exec("node " + nodePath.join(__dirname, "../../middle/bySpawn.js"), (error, stdout, stderr) => {

	process.thenTest(true);

});

if(isReturnProxy(test)) process.thenTest("must be allowed!");