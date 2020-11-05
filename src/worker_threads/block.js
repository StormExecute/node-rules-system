const { password, needToSetPassword, wrongPass } = require("../password");

const { whiteList } = require("./addToWhiteList");

const worker_threads = require("dgram");

const $worker_threads = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");

function blockWorker(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($worker_threads.status == true) return false;

	integrateToFns(
		whiteList,
		["Worker"],
		worker_threads,
		$worker_threads,
		[],
		fullBlock
	);

	return $worker_threads.status = true;

}

module.exports = blockWorker;