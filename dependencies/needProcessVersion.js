/*
 *
 *	needProcessVersion.js
 *
 *	A tool for checking that the required node.js version is available
 *
 *	(c) 2020-11-11 Cameron Osakiski
 *
 *	This script may be freely distributed under the MIT license.
 *
*/

let cachedProcessVersionArr = null;

function gerVersionArr(arg) {

	const versionArr = [];
	let pointer = 0;

	for(let i = 0; i < arg.length; ++i) {

		const sym = arg[i];

		if(
			sym == "0" || sym == "1" || sym == "2" || sym == "3" ||
			sym == "4" || sym == "5" || sym == "6" || sym == "7" ||
			sym == "8" || sym == "9"
		) {

			if(pointer + 1 > versionArr.length) {

				versionArr[pointer] = sym;

			} else {

				versionArr[pointer] += sym;

			}

		} else if(sym == "." && pointer < 2) {

			versionArr[pointer] = parseInt(versionArr[pointer++]);

		}

	}

	return versionArr;

}

/*

	process.version = "10.0.0";

	const ex1 = needProcessVersion("9.0.0"); //1

	~ex1; //true if result is 1 or 0
	!~ex1; //true if result is -1

	if(~ex1) newFeatures();
	else if(!~ex1) nothing();

*/

module.exports = function needProcessVersion(version) {

	const needVersionArr = gerVersionArr(version);
	if(needVersionArr.length != 3) return -1;

	const processVersionArr = cachedProcessVersionArr || gerVersionArr(process.version);
	if(processVersionArr.length != 3) return -1;

	processVersionArr[2] = parseInt(processVersionArr[2]);
	needVersionArr[2] = parseInt(needVersionArr[2]);

	if(!cachedProcessVersionArr) {

		cachedProcessVersionArr = new Array(3);

		for (let i = 0; i < 3; ++i) {

			cachedProcessVersionArr[i] = processVersionArr[i];

		}

	}

	if(processVersionArr[0] > needVersionArr[0]) {

		return 1;

	} else if(processVersionArr[0] < needVersionArr[0]) {

		return -1;

	} else if(processVersionArr[0] == needVersionArr[0]) {

		if(processVersionArr[1] > needVersionArr[1]) {

			return 1;

		} else if(processVersionArr[1] < needVersionArr[1]) {

			return -1;

		} else if(processVersionArr[1] == needVersionArr[1]) {

			if(processVersionArr[2] > needVersionArr[2]) {

				return 1;

			} else if(processVersionArr[2] < needVersionArr[2]) {

				return -1;

			} else if(processVersionArr[2] == needVersionArr[2]) {

				return 0;

			}

		}

	}

	return -1;

};