const { NRS_PASSWORD } = require("../_settings");

const NRS = require("../../src/index");
const NRS_SESSION = NRS.session(NRS_PASSWORD);

NRS_SESSION.connections.block();
NRS_SESSION.connections.addPathsToWhiteList({

	whiteListDomains: "https://github.com"

});

NRS_SESSION.getLogsEmitter().on("*", obj => console.log(obj));

const logger = require("./thirdPartyPrettyLogger");

logger("START REQUEST!");

const request = require("request");

request("https://github.com", function () {

	logger("END REQUEST!");

});