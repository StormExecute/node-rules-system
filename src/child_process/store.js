const $childProcess = {

	status: false,

	ChildProcess: null,

	exec: null,
	execSync: null,

	execFile: null,
	execFileSync: null,

	fork: null,
	_forkChild: null,

	spawn: null,
	spawnSync: null,

};

module.exports = $childProcess;