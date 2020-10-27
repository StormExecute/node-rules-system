module.exports = function(response) {

	let str = '';

	//another chunk of data has been received, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});

	//the whole response has been received, so we just print it out here
	response.on('end', function () {

		process.thenTest(true);

	});

};