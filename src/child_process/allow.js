const { password, needToSetPassword, wrongPass } = require("../password");

const { wrongPassEmitter } = require("../logs");

const child_process = require("child_process");

const $childProcess = require("./store");

const restore = require("../restore");

function allowChildProcess(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowChildProcess");

	if($childProcess.status == false) return false;

	restore(
		["ChildProcess", "exec", "execSync", "execFile", "execFileSync", "fork", "_forkChild", "spawn", "spawnSync"],
		child_process,
		$childProcess
	);

	$childProcess.status = false;

	return true;

}

module.exports = allowChildProcess;