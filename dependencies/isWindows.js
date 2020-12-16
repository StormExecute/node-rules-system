const { StringStartsWith } = require("../src/_data/primordials");

//process.platform cannot be changed.
module.exports = StringStartsWith( process.platform, "win" );