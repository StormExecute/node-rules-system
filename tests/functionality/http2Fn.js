module.exports = function fn(should, client) {

	return client.request({

		":path": "/"

	})
		.on("response", (headers, flags) => {})
		.on("data", chunk => {})
		.on("end", () => {

			client.close();

			if(should == "allow") return process.thenTest(true);
			else return process.thenTest("must be blocked!")

		})
		.end();

};