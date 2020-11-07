const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const cluster = require("cluster");

const $cluster = require("./store");

const restore = require("../restore");

function allowFork(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowCluster");

	if($cluster.status == false) return false;

	restore(
		["fork"],
		cluster,
		$cluster
	);

	$cluster.status = false;

	return true;

}

module.exports = allowFork;