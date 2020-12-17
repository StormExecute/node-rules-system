const { Proxy } = require("./_data/primordials");

const get = (_, prop) => {

	if(prop == Symbol.toPrimitive) {

		return () => "0"

	} else if(prop == "then") {

		return awaitProxy;

	} else {

		return returnProxy;

	}

}

const awaitProxy = new Proxy({}, {

	get,

})

const returnProxy = new Proxy(class {}, {

	get,
	has: () => returnProxy,
	deleteProperty: () => returnProxy,
	apply: () => returnProxy,
	construct: () => returnProxy,

});

module.exports = returnProxy;