const mathRandom = Math.random;

const getRandomSaltForVar = () => mathRandom().toString().slice(2);

module.exports = {

	mathRandom,
	getRandomSaltForVar,

};