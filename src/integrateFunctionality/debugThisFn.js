const debugIntegrateFunctionality = !!process.argv.filter(el => el == "--debugI").length || process.env.debugI;

module.exports = debugIntegrateFunctionality;