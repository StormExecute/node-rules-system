const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const { whiteList } = require("./addToWhiteList");

const cluster = require("cluster");

const $cluster = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");

function blockFork(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockCluster");

	if($cluster.status == true) return false;

	integrateToFns(
		whiteList,
		["fork"],
		cluster,
		$cluster,
		[],
		fullBlock
	);

	return $cluster.status = true;

}

module.exports = blockFork;