const { password, needToSetPassword, wrongPass } = require("./password");

const { wrongPassEmitter } = require("./logs");

module.exports = function makeFullSecure(
	connections, fs,
	process, child_process, dgram, worker_threads, cluster,
	timers
) {

	function fullSecure(tryPass, status) {

		status = status || "enable";

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "fullSecure", { status });

		return status == "enable" ? [

			connections.block(tryPass),
			fs.block(tryPass),

			process.block(tryPass),

			child_process.block(tryPass),
			dgram.block(tryPass),
			worker_threads.block(tryPass),
			cluster.block(tryPass),

			timers.integrate(tryPass),

		] : [

			connections.allow(tryPass),
			fs.allow(tryPass),

			process.allow(tryPass),

			child_process.allow(tryPass),
			dgram.allow(tryPass),
			worker_threads.allow(tryPass),
			cluster.allow(tryPass),

			timers.restore(tryPass),

		];

	}

	return {

		fullSecure,

		enableFullSecure: function (tryPass) {

			return fullSecure(tryPass, "enable");

		},

		disableFullSecure: function (tryPass) {

			return fullSecure(tryPass, "disable");

		},

	}

};