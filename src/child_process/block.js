const { password, needToSetPassword, wrongPass } = require("../password");

const { whiteList } = require("./addToWhiteList");

const child_process = require("child_process");

const $childProcess = require("./store");

const integrateToFns = require("../integrateFunctionality/toFns");

function blockChildProcess(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) throw new Error(wrongPass);

	if($childProcess.status == true) return false;

	integrateToFns(
		whiteList,
		["ChildProcess", "exec", "execSync", "execFile", "execFileSync", "fork", "_forkChild", "spawn", "spawnSync"],
		child_process,
		$childProcess,
		["internal/cluster/master.js"],
		fullBlock
	);

	return $childProcess.status = true;

}

module.exports = blockChildProcess;