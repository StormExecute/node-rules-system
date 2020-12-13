const {

	ObjectPrototypeToString,
	ReflectApply,

} = require("../src/_data/primordials");

module.exports = obj => ReflectApply(ObjectPrototypeToString, obj, []) === '[object Object]';