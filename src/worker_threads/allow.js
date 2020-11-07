const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const worker_threads = require("worker_threads");

const $worker_threads = require("./store");

const restore = require("../restore");

function allowWorker(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowWorkerThreads");

	if($worker_threads.status == false) return false;

	restore(
		["Worker"],
		worker_threads,
		$worker_threads
	);

	$worker_threads.status = false;

	return true;

}

module.exports = allowWorker;