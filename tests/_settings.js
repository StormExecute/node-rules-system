const options = {

	//this is a test export, DO NOT USE THIS in real projects, as it will make it easier for malicious modules to hack the application!
	NRS_PASSWORD: "123".repeat(3) + Math.random(),
	//for real projects DO NOT EXPORT the password in any case and use the following construction once in main file:
	//const pass = "your_pass" + Math.random();
	//NRS.init(pass);

	TEST_SITE: "www.example.com",

	MAX_WAIT_INTERVAL_BEFORE_THROW: 5500,
	MAX_WAIT_INTERVAL_BEFORE_NEXT_CONNECTION_TEST: 700,
	MAX_WAIT_INTERVAL_BEFORE_NEXT_FS_TEST: 500,
	MAX_WAIT_INTERVAL_BEFORE_NEXT_OTHER_TEST: 400,

	BLOCK_CONSOLE_LOG_DASH_REPEATS: 15,

};

module.exports = options;