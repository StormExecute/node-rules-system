const request = require("../../functionality/requestController");

module.exports = () => request("block", () => process.thenTest("must be blocked!"));