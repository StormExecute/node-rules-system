if(!process.platform.includes("linux")) {

	throw new Error("nvm tests can only be run on Linux");

}

const { spawn } = require('child_process');

const { BLOCK_CONSOLE_LOG_DASH_REPEATS: repeats } = require("./_settings");

const blockLogDash = text => console.log("\x1b[34m%s\x1b[0m", "-".repeat(repeats) + text + "-".repeat(repeats) + "\n");

const nvmLS = [

	"9.2.0",
	"10.1.0",
	"11.1.0",
	"11.14.0",
	"12.0.0",
	"12.12.0",
	"13.0.0",
	"13.5.0",
	"14.12.0",

];

const $home = process.env.SUDO_USER ? "/home/" + process.env.SUDO_USER : process.env.HOME;

const runOnlyConnectionTests = !!process.argv.filter(el => el == "-c" || el == "--connections").length || process.env.debugP;
const runOnlyFsTests = !!process.argv.filter(el => el == "-s" || el == "--fs").length || process.env.debugP;
const runOnlyOtherTests = !!process.argv.filter(el => el == "-o" || el == "--others").length || process.env.debugP;

const flag = (function () {

	if(runOnlyConnectionTests) {

		return "-c";

	} else if(runOnlyFsTests) {

		return "-s";

	} else if(runOnlyOtherTests) {

		return "-o";

	} else {

		return null;

	}

})();

function test() {

	if(!nvmLS.length) return process.exit(0);

	const thisTest = nvmLS.shift();

	const args = ["index.js"];

	if(flag) {

		args.push(flag);

	}

	let experimental = "";

	if(thisTest == "11.1.0") {

		args.splice(0, 0, "--experimental-worker");

	}

	blockLogDash("TESTS WITH NODE " + thisTest + " STARTED!");

	const t = spawn( $home + "/.nvm/versions/node/v" + thisTest + "/bin/node", args);

	t.stdout.on("data", function (data) {

		data = data.toString();

		if(data == "\n") return;

		if( data.includes("\x1B[34m") ) {

			data = data.slice(0, -1);

		}

		data = data.replace(/\n+/g, "\n");

		console.log(data);

	});

	t.stderr.on("data", function (data) {

		data = data.toString();

		if(data.includes("ExperimentalWarning")) return;

		console.error("\x1b[31m%s\x1b[0m", data)

		process.exit();

	});

	t.on('close', code => {

		blockLogDash("TESTS WITH NODE " + thisTest + " COMPLETED!");

		setTimeout(test, 1000);

	});

}

test();