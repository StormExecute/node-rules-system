const returnProxy = new Proxy(class {}, {

	get: (_, prop) => {

		if(prop == Symbol.toPrimitive) {

			return () => "0"

		} else {

			return returnProxy;

		}

	},
	has: () => returnProxy,
	deleteProperty: () => returnProxy,
	apply: () => returnProxy,
	construct: () => returnProxy,

});

module.exports = returnProxy;