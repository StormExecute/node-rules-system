function restore(propsArray, origin, backup) {

	for(let i = 0; i < propsArray.length; ++i) {

		const el = propsArray[i];

		origin[el] = backup[el];
		backup[el] = null;

	}

}

module.exports = restore;