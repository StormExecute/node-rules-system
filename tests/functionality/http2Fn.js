const needProcessVersion = require("../../dependencies/needProcessVersion");

let then = false;

module.exports = function fn(should, client) {

	const next = function () {

		if(should == "allow") return process.thenTest(true);
		else return process.thenTest("must be blocked!");

	}

	return client.request({

		":path": "/"

	})
		.on("response", (headers, flags) => {})
		.on("data", chunk => {

			if(~needProcessVersion("12.12.0") && !~needProcessVersion("14.12.0")) {

				if(then) return;

				then = false;

				next();

			}

		})
		.on("end", () => {

			if(then) return;

			then = true;

			if(typeof client.close == "function") {

				client.close();

			}

			next();

		})
		.end();

};