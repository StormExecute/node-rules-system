const { NRS_PASSWORD } = require("../../_settings");

const NRS_SESSION = require("../../../" + NRS_PATH).session(NRS_PASSWORD);

module.exports = function () {

	NRS_SESSION.timers.reset(() => process.thenTest(true));

}