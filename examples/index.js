global.NRS_PATH_SRC = true;
global.NRS_PATH = NRS_PATH_SRC ? "src/index.js" : "lib/NRS.js";

const NRS = require("../" + NRS_PATH);

//DONT EXPORT NRS_PASSWORD! USE MATH.RANDOM() AS THE SALT ALWAYS!
const NRS_PASSWORD = "somePassword" + Math.random();

NRS.init(NRS_PASSWORD);
NRS.fullSecure(NRS_PASSWORD, "enable");

//DONT EXPORT NRS_SESSION!
const FAST_NRS_SESSION = NRS.session(NRS_PASSWORD);
FAST_NRS_SESSION.startRecordLogs();

//FOR MORE SECURITY, USE ENDINGS .JS ALWAYS!
NRS.connections.addPathsToWhiteList(NRS_PASSWORD,
	["examples/indexFunctionality.js", "examples/index.js"]
);

const { requestFn, canContinue } = require("./indexFunctionality");

let timer = null;

function checkReadiness() {

	return timer = setTimeout(() => {

		if(canContinue.value == true) {

			clearTimeout(timer);
			example();

		} else {

			checkReadiness();

		}

	}, 30);

}

function example() {

	requestFn(function (str) {

		if(!str) {

			console.error("index.js: must be allowed!");
			process.exit(1);

		} else {

			console.log("DONE!", FAST_NRS_SESSION.getAllLogs());
			process.exit(0);

		}

	});

}

checkReadiness();