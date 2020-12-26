# node-rules-system (NRS) [![NPM version][npm-image]][npm-url]

Rights Manager, focused mainly on controlling HTTP requests and the file system, so that malicious modules do not cause damage to Your application!

# NOTE

We recommend reading the latest README on the main github branch, as due to small edits to the description, we will not update the entire package on the NPM platform: [node-rules-system README.md](https://github.com/StormExecute/node-rules-system/blob/master/README.md).

# Description

NRS can intercept all possible ways to make a request, as well as set traps for the standard fs module, thereby giving you the right to set permissions for certain modules.

NRS uses a system for obtaining a stack of paths, the processing of which guarantees the correct granting of rights to certain files to perform actions. **NOTE**: in some cases, the exact stack of paths to the parent cannot be obtained, **NRS.timers.integrate** is used to solve this problem, for more information, see **Troubleshooting**.

NRS by default blocks access to functions for all paths, you are free to create a white list, based on which NRS will issue access rights. You can also handle the path stack yourself using the customHandler option.

If used correctly, NRS can become a reliable protection against malicious modules and a faithful assistant in other matters.

The main thing in using this system is the correct configuration for the necessary dependencies and project paths. This may take some time, because to provide full protection, NRS can block auxiliary modules such as child_process, cluster, worker_threads, dgram, and process.binding, process._linkedBinding, process.dlopen (blocking occurs because the described modules can spawn new processes where NRS may not be initialized, and also because some functions may cause non-standard ways to perform prohibited actions).

If you are using a new ESM syntax (namely a new syntax provided by nodejs or typescript that does not convert imports to requires) - you should use a different module: [node-rules-system-esm](https://www.npmjs.com/package/node-rules-system-esm), since exact security in such an environment requires immediate initialization, see.

# Changelog

[HERE!](https://github.com/StormExecute/node-rules-system/blob/master/CHANGELOG.md)

# Table of Contents

* [Install](#install)
* [Usage](#usage)
* [How it works](#howitworks)
* [Troubleshooting](#troubleshooting)
* [Debug](#debug)
* [API](#api)
* [Contacts](#contacts)

<a name="install"></a>
# Install

The correct installation is to install directly into the main application, so we do not recommend third-party dependencies to install NRS as a dependency, as this system must be managed by the main executable.

To test a special NRS response, a third-party module can use the try/catch require("node-rules-system").**isReturnProxy** construction.

Subject:

```bash
$ npm install node-rules-system
```

<a name="usage"></a>
# Usage

### Example #0 (Basics):

```javascript

const NRS = require("node-rules-system");
NRS.init("yourPassword");
NRS.enableFullSecure("yourPassword");

```

### Example #1 (Native http):

~/NRS/examples/index.js:

```javascript

const NRS = require("node-rules-system");

//DONT EXPORT NRS_PASSWORD! USE MATH.RANDOM() AS THE SALT ALWAYS!
const NRS_PASSWORD = "somePassword" + Math.random();

NRS.init(NRS_PASSWORD);
NRS.fullSecure(NRS_PASSWORD, "enable");

//DONT EXPORT NRS_SESSION!
const FAST_NRS_SESSION = NRS.session(NRS_PASSWORD);
FAST_NRS_SESSION.startRecordLogs();

//wrapPath = index.js, has access rights if nativePath is equal to onlyForExport.js
//nativePath = onlyForExport.js, has rights to an http request only within a wrapPath call
//FOR MORE SECURITY, USE ENDINGS .JS ALWAYS!
NRS.connections.addPathsToWhiteList(NRS_PASSWORD,
	["examples/indexFunctionality.js", "examples/index.js"]
);

const { requestFn, canContinue } = require("./indexFunctionality");

let timer = null;

function checkReadiness() {

	return timer = setTimeout(() => {

		if(canContinue.value == true) {

			clearTimeout(timer);
			example();

		} else {

			checkReadiness();

		}

	}, 30);

}

function example() {

	requestFn(function (str) {

		if(!str) {

			console.error("index.js: must be allowed!");
			process.exit(1);

		} else {

			console.log("DONE!", FAST_NRS_SESSION.getAllLogs());
			process.exit(0);

		}

	});

}

checkReadiness();

```

~/NRS/examples/indexFunctionality.js:

```javascript

const { isReturnProxy } = require("node-rules-system");

const http = require("http");

let canContinue = { value: false };

function requestFn(callback) {

	const req = http.request({

		host: "www.example.com"

	}, response => {

		let str = '';

		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {

			callback(str);

		});

	}).end();

	if(isReturnProxy(req)) {

		callback(false);

	}

}

requestFn(function (str) {

	if(str == false) {

		canContinue.value = true;

	} else {

		console.error("indexFunctionality: must be blocked!");
		process.exit(1);

	}

});

module.exports = {

	requestFn,
	canContinue,

};

```

```bash

$ pwd

/home/ghost/NodeProjects/node-rules-system

$ node examples/index.js 

DONE! [
  {
    type: 'setPassword',
    callerPaths: [ '/home/ghost/NodeProjects/node-rules-system/examples/index.js' ],
    where: 'init'
  },
  {
    type: 'addToWhiteList',
    callerPaths: [ '/home/ghost/NodeProjects/node-rules-system/examples/index.js' ],
    '$corePath': '/home/ghost/NodeProjects/node-rules-system/',
    whiteList: 'connections',
    grantRights: true,
    args: [ [Array] ]
  },
  {
    type: 'callFn',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/indexFunctionality.js',
      '/home/ghost/NodeProjects/node-rules-system/examples/indexFunctionality.js'
    ],
    grantRights: false,
    fn: 'request',
    args: [Arguments] { '0': [Object], '1': [Function (anonymous)] },
    calledAsClass: false
  },
  {
    type: 'callFn',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/indexFunctionality.js',
      '/home/ghost/NodeProjects/node-rules-system/examples/index.js',
      '/home/ghost/NodeProjects/node-rules-system/examples/index.js',
      '/home/ghost/NodeProjects/node-rules-system/lib/NRS.js',
      '/home/ghost/NodeProjects/node-rules-system/examples/index.js',
      '/home/ghost/NodeProjects/node-rules-system/examples/index.js'
    ],
    grantRights: true,
    fn: 'request',
    args: [Arguments] { '0': [Object], '1': [Function (anonymous)] },
    calledAsClass: false
  }
]

```

### Example #2 (With node-fetch):

~/NRS/examples/secondUsageExample.js:

```javascript

const NRS = require("node-rules-system");

//node-fetch can be required at this level
const fetch = require("node-fetch");
const nodePath = require("path");

//DONT EXPORT NRS_PASSWORD! USE MATH.RANDOM() AS THE SALT ALWAYS!
const NRS_PASSWORD = "somePassword" + Math.random();

//IF YOU STILL NEED TO EXPORT THE SESSION, USE THIS CONSTRUCTION:
const SECURE_NRS_SESSION = NRS.secureSession(NRS_PASSWORD, "examples/secondUsageExample.js");
SECURE_NRS_SESSION.startRecordLogs();

SECURE_NRS_SESSION.enableFullSecure();

SECURE_NRS_SESSION.connections.addDependencyAndPathsToWhiteList(
	["node-fetch", "examples/secondUsageExample.js"]
);

const URL = "http://www.example.com";

const cwd = (() => {

	const _ = process.cwd();

	if(_.endsWith("/examples")) return _;

	return nodePath.join(_, "./examples");

})();

fetch(URL)
	.then(res => res.text())
	.then(body => {

		console.log("DONE!", SECURE_NRS_SESSION.getAllLogs());

	});

const thisLogs = SECURE_NRS_SESSION.getAllLogs();

// -2 because the real last log is callFromSecureSession
const lastLog = thisLogs[thisLogs.length - 2];

if (
	lastLog.type == "callFn"
	&&
	lastLog.callerPaths[0] == nodePath.join(
		cwd,
		"../node_modules/node-fetch/lib/index.js"
	)
	&&
	lastLog.callerPaths[ lastLog.callerPaths.length - 1 ] == nodePath.join(
		cwd,
		"./secondUsageExample.js"
	)
) {

	if(lastLog.grantRights == false) {

		throw "must be allowed!";

	}

} else {

	throw "something went wrong!";

}

```

```bash

$ pwd

/home/ghost/NodeProjects/node-rules-system

$ cd examples/
$ node secondUsageExample.js 

DONE! [
  {
    type: 'setPassword',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js'
    ],
    where: 'secureSession'
  },
  {
    type: 'callFromSecureSession',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js'
    ],
    grantRights: true,
    NRSFnName: 'fullOrSetSecure',
    NRSFnPropName: 'enableFullSecure',
    args: []
  },
  {
    type: 'callFromSecureSession',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js'
    ],
    grantRights: true,
    NRSFnName: 'connections',
    NRSFnPropName: 'addDependencyAndPathsToWhiteList',
    args: [ [Array] ]
  },
  {
    type: 'addToWhiteList',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js'
    ],
    '$corePath': '/home/ghost/NodeProjects/node-rules-system/',
    whiteList: 'connections',
    grantRights: true,
    args: [ [Array] ]
  },
  {
    type: 'callFn',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/node_modules/node-fetch/lib/index.js',
      '/home/ghost/NodeProjects/node-rules-system/node_modules/node-fetch/lib/index.js',
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js'
    ],
    grantRights: true,
    fn: 'request',
    args: [Arguments] { '0': [Object] },
    calledAsClass: false
  },
  {
    type: 'callFromSecureSession',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js'
    ],
    grantRights: true,
    NRSFnName: 'logs',
    NRSFnPropName: 'getAllLogs',
    args: []
  },
  {
    type: 'callFromSecureSession',
    callerPaths: [
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js',
      '/home/ghost/NodeProjects/node-rules-system/examples/secondUsageExample.js'
    ],
    grantRights: true,
    NRSFnName: 'logs',
    NRSFnPropName: 'getAllLogs',
    args: []
  }
]

```
<a name="howitworks"></a>
# How it works
1. NRS overwrites all sorts of native ways to call a request and/or modify the file system.
2. When a script wants to connect a native method of performing an action, it actually gets a modified function, which can only be accessed by the one who was given rights, based on the path algorithm.
3. When a script calls a modified function, the following happens.
4. if NRS is integrated with the fullBlock parameter, **returnProxy** is returned. Read more below.
4. NRS generates a light error and takes the path stack from it, then filters it and returns it to the callerPaths variable. At this stage, if any method from NRS.timers is integrated, the path stack can also be memorized and/or merged. For more information, see [source code](https://github.com/StormExecute/node-rules-system/blob/3cd8afbbf7d4f3851c32b266eec56787feb0499d/src/getCallerPaths.js).
5. If !callerPaths.length - NRS logs the circumstances and returns **returnProxy**.
6. If settings.useIsCallerPathInsteadTrustedAllowlist == true and callerPaths[0] is part of allowList, **the original function call** is returned(without logging).
7. If settings.useIsCallerPathInsteadTrustedAllowlist == false and !isCallerPath( callerPaths[0]) - **the original function call** is returned(without logging).
8. Happens iterates the array of white lists.
9. If customHandler is set, the access variable is equal to the result of calling customHandler, otherwise the special checkAccess function is called with the options object of the current whitelist. For more information about checkAccess, see [source code](https://github.com/StormExecute/node-rules-system/blob/3cd8afbbf7d4f3851c32b266eec56787feb0499d/src/integrateFunctionality/checkAccess.js).
10. If the variable access == true, **the original function call is logged and returned**, otherwise callFn with granRights=false is logged and **returnProxy** is returned.

returnProxy is a special proxy variable of the NRS environment that is returned in cases when the action is blocked. When accessing or calling any properties of this variable, this variable returns itself, which allows you to ignore any errors in the future. For more information, see [source code](https://github.com/StormExecute/node-rules-system/blob/3cd8afbbf7d4f3851c32b266eec56787feb0499d/src/returnProxy.js).

<a name="troubleshooting"></a>
# Troubleshooting

### Problem with a sliced path stack

*NOTE: part of the solution to this problem is included in the **NRS.enableFullSecure** method, so you may not encounter an unpleasant path logic violation, however, for a General understanding of how NRS works, it is recommended to read the solution to this possible situation.*

This problem is observed with functions such as _setImmediate_, _process.nextTick_, _setTimeout_, _setInterval_, _Promise.prototype.then_, _Promise.prototype.catch_, _EventEmitter.prototype.on_, _fs.readFile_, and _fs.writeFile_, because they have a special execution structure in the next tick. The ancestor is basically *internal/timers* that break the logical chain.

The solution to this problem, to some extent, is to remember the current stack of paths before calling the above functions, and also merge such stacks in case of massive further calls. The **NRS.timers.integrate** method sets up special hooks to track such calls and may be a solution to the problem, however there are some additional points to consider.

It often happens that the path stack becomes larger than the default **Error.stackTraceLimit** value, which also breaks the logic, _so NRS by default, when initializing itself from require, sets **Error.stackTraceLimit** to **100**_, but if this value changes during your application, it may break the logic of the path stack.

The second point is the calls of forbidden requests from the just allowed request. By default, the specifics of granting path access will find allowed paths in the stack and possibly allow a forbidden request by mistake. Although this problem may occur independently of calling the above-mentioned functions, it is often these functions that are the initializers of the problem.

The solution to the second point, especially when combined with timer integration, is to call the **NRS.timers.reset** method in a separate file. For more information, see In the method description.

Also, a generalized and more recommended solution for the second point, even when combined with timers, is to pass additional path stack filtering, such as the **onlyWhited** option.

### Function callback freeze issue

Sometimes it happens that after calling a function that implies an allowed request, the callback is not called, and it will seem in the logs that the rights to the request were not granted.

If we consider that this request is 100% allowed, but the rights were not granted to it - perhaps the error lies in unexpected internal modules of nodejs.

The point is that NRS by default uses a whitelist of internal nodejs modules that will be granted access by default. But it is possible that in some versions this list can change, accordingly, freezing the native execution process and returning false in grantRights.

The solution to this problem is the **NRS.settings.useIsCallerPathInsteadTrustedAllowList(password, true)** method. Read more in the description of the method.

<a name="debug"></a>
# Debug
The following flags are used for NRS debug:
* _--nrs-debugI_: Captures calls with src/integrateFunctionality/*
* _--nrs-debugP_: Captures final callerPaths
* _--nrs-debugF_: Captures all sorts of file names before filtering paths
* _--nrs-debugT_: Captures calls with src/timers/integrate.js
* _--nrs-debugO_: Captures calls from places like src/fs/block.js, src/secureSession.js and process/blockBindings.js
* _--nrs-debugAll_: Enables all debug flags

<a name="api"></a>
# API

Types: [HERE!](https://github.com/StormExecute/node-rules-system/blob/master/%40types/index.d.ts)

### NRS.init: (newPassword: string) => boolean
Sets the password required to work with NRS methods.

**Example**:

```javascript

const NRS = require("node-rules-system");
const salt = Math.random();

NRS.init("yourPassword" + salt); // -> true
NRS.init("newPassword" + salt); // -> throw new Error(passAlready)

```

### NRS.reInit: (lastPassword: string, newPassword: string) => boolean
Sets a new password. The old password required.

**Example**:

```javascript

const NRS = require("node-rules-system");

const salt = Math.random();
const pass = "yourPassword" + salt;

NRS.init(pass); // -> true
NRS.reInit(pass, "newPassword" + Math.random()); // -> true

```

### NRS.session: (tryPass: string) => sessionT
Returns a session that does not require a password to call functions. Approximate session interface: [HERE!](https://github.com/StormExecute/node-rules-system/blob/a369f1b8e13778334ea02ac13650995823014d13/%40types/index.d.ts#L793)


**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();

const NRS_SESSION = NRS.session(pass);
//NRS_SESSION.enableFullSecure();

```

### NRS.secureSession: (tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]) => sessionT
The same as NRS.session, only the function needs to receive an additional wrapper, which gives access only if the file matches the predefined paths.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();

const NRS_SESSION = NRS.secureSession(pass, "someIndexFile.js", "someOtherFile.js");
//NRS_SESSION.enableFullSecure();

```

### NRS.fullSecure: (tryPass: string, status: string) => secureReturn
If status equals true - alias of:

* NRS.connections.block(tryPass)
* NRS.fs.block(tryPass)
* NRS.process.block(tryPass)
* NRS.child_process.block(tryPass)
* NRS.worker_threads.block(tryPass)
* NRS.cluster.block(tryPass)
* NRS.timers.integrate(tryPass)

Else:

* NRS.connections.allow(tryPass)
* NRS.fs.allow(tryPass)
* NRS.process.allow(tryPass)
* NRS.child_process.allow(tryPass)
* NRS.worker_threads.allow(tryPass)
* NRS.cluster.allow(tryPass)
* NRS.timers.restore(tryPass)

### NRS.enableFullSecure: (tryPass: string) => secureReturn
Alias of NRS.fullSecure(tryPass, "enable").

### NRS.disableFullSecure: (tryPass: string) => secureReturn
Alias of NRS.fullSecure(tryPass, "disable").

### NRS.setSecure: (tryPass: string, status: string, secureElements: secureElementsList[]): secureSetReturn
Blocks/Integrates or Allows/Restores certain functions passed to secureElements.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.setSecure(pass, "enable", ["connections", "fs", "timers"]);

```

### NRS.setSecureEnable: (tryPass: string, secureElements: secureElementsList[]) => secureSetReturn
Alias of NRS.setSecure(tryPass, "enable", secureElements).

### NRS.setSecureDisable: (tryPass: string, secureElements: secureElementsList[]) => secureSetReturn
Alias of NRS.setSecure(tryPass, "disable", secureElements).

## NRS.settings

Defaults:

```json

{

	"throwIfWrongPassword": true,
	"changeModuleRandomSignInterval": 0,
	"useIsCallerPathInsteadTrustedAllowList": false

}

```

### NRS.settings.get: (tryPass: string) => settingsStoreT
Returns a copy of the NRS settings object.

### NRS.settings.useIsCallerPathInsteadTrustedAllowList: (tryPass: string, status: boolean) => boolean
Sets useIsCallerPathInsteadTrustedAllowlist to status. This option is responsible for filtering the path stack. If set to false, a predefined allowList is used for the corresponding function ([example](https://github.com/StormExecute/node-rules-system/blob/3cd8afbbf7d4f3851c32b266eec56787feb0499d/src/connections/block.js#L146), the 5th argument). Otherwise, the special function isCallerPath is used in inverted logic: if the path starts with / or [a-zA-Z]:\ - returns true, else false.

**Examples of paths that will be resolved with !isCallerPath:**

*["_http_client.js", "_http_agent.js", "util.js", "internal/util.js"]*

**Examples of paths that will be resolved with isCallerPath:**

_["/home/user/app/index.js", "C:\\app\\index.js"]_

### NRS.settings.setChangeModuleRandomSignInterval: (tryPass: string, ms: number, immediately?: boolean) => boolean | number
Sets changeModuleRandomSignInterval to ms. If passed immediately=true, forcibly resets the previous timer. If all conditions are met, it can return the timer ID. The changeModuleRandomSignInterval option is responsible for the time before changing the random signature used in NRS.module (initially set to 0, which means that the timer is not started). _Changing the random signature is an experimental idea and can be supplemented in the future, so we do not recommend using this feature yet_.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

//set
NRS.settings.setChangeModuleRandomSignInterval(pass, 1000);

setTimeout(() => {

	//restore
	NRS.settings.setChangeModuleRandomSignInterval(pass, 0, true);

}, 1100);

```

### NRS.settings.throwIfWrongPassword: (tryPass: string) => boolean
Sets throwIfWrongPassword to true. This option is responsible for throwing an exception if an invalid password is passed to some method. If false, returns false.

### NRS.settings.dontThrowIfWrongPassword: (tryPass: string) => boolean
Sets throwIfWrongPassword to false.

### NRS.settings.setCorePath: (tryPass: string, path: string) => boolean
Sets $corePath.value to path. $corePath is a separate object that is not related to the settings object. Its value is responsible for the root directory of the application startup. The default value is obtained by the algorithm written [HERE](https://github.com/StormExecute/node-rules-system/blob/3cd8afbbf7d4f3851c32b266eec56787feb0499d/src/whiteListFunctionality.js#L42).

### NRS.settings.$getCorePath: () => string
Returns $corePath.value. This function does not require a password.

### NRS.getLogsEmitter: (tryPass: string) => logs
Returns a special instance from the EventEmitter class that allows you to accept logs.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.getLogsEmitter(pass).on("*", obj => console.log(obj));
NRS.getLogsEmitter(pass).on("callFn", obj => console.log(obj));
NRS.getLogsEmitter(pass).onMany(["callFn", "callObj", "callProtoFn"], obj => console.log(obj));

```

### NRS.getAllLogs: (tryPass: string) => Array<logMessage>
Returns a copy of the log array. For more information, see the Declaration file at @types/index.d.ts.

### NRS.getUniqLogs: (tryPass: string) => Array<logMessage>
Same as NRS.getAllLogs, only with a unique sort.

### NRS.startRecordLogs: (tryPass: string) => boolean
By default, NRS logs to the allLogs variable only setting and changing the password, this method will tell NRS to write all sorts of events to this variable. Regardless of the call to this function, NRS.getLogsEmitter(pass).on("*") will catch all logs.

### NRS.stopRecordLogs: (tryPass: string) => boolean
Tells NRS to stop writing all sorts of logs to the allLogs variable (returns to NRS.getAllLogs)

### NRS.isReturnProxy: (argument: any) => boolean
Compares argument with returnProxy and returns the result. This method does not require a password. For more information about returnProxy, see the section "How it works". _It is recommended for use by third-party modules as a test for a special NRS response._

## NRS.connections|fs|child_process|dgram|worker_threads|cluster->whiteListMethods
For a clearer understanding of the arguments that whitelist methods accept, it is recommended that you read the Declaration file [here](https://github.com/StormExecute/node-rules-system/blob/3cd8afbbf7d4f3851c32b266eec56787feb0499d/%40types/index.d.ts#L390).

If we take into account the transfer of an object, then the description of the transmitted properties will be as follows:
* _paths_: Paths to be present.
* _blackPaths_: Paths that shouldn't be.
* _whiteListDomains_: ONLY FOR NRS.connections - domain whiteList.
* _blackListDomains_: ONLY FOR NRS.connections - domain blackList.
* _callerFnName_: The name of the parent function, which must match the real one received from callerPaths[0].
* _onlyWhited_: The callerPaths array should only contain the passed paths, comparison via startsWith.
* _everyWhite_: Almost the same as onlyWhited, but with a strict relationship to the sequence of elements.
* _fullIdentify_: The callerPaths must be identical to paths.
* _customHandler_: A custom access handler that should return a Boolean value - whether to grant access. For more information about arguments, see the Declaration file.

### NRS.*.addCustomPathsToWhiteList: (tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]) => boolean
Adds absolute paths to the new whiteList. 

**Example**

```javascript

const NRS = require("node-rules-system");
const nodePath = require("path");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.connections.addCustomPathsToWhiteList(
	pass,
	"/home/user/app/thePathForNewWhiteList.js",
	nodePath.join(NRS.settings.$getCorePath(), "./thePathForSecondWhiteList.js"),
	["/home/user/app/controller.js", "/home/user/app/caller.js"],
	{
		paths: "/home/user/app/thisIsPathForFourthWhiteList.js"
	}
);

NRS.fs.connections.addCustomPathsToWhiteList(pass, ["/home/user/app/pathForWhiteListOfFs.js"]);

```

### NRS.*.addPathsToWhiteList: (tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]) => boolean
Adds paths to the new whitelist by merging with corePath.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.connections.addPathsToWhiteList(pass, ["index.js"]);

NRS.connections.addPathsToWhiteList(pass, {

	paths: ["src/controller.js", "src/caller.js", "bin/index.js"],
	onlyWhited: true,

}, {

	whiteListDomains: ["http://example.com", "https://github.com"],

});

```

### NRS.*.addDependencyAndPathsToWhiteList: (tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]) => boolean
The same as addPathsToWhiteList only with unique processing of the first element(meaning 1 processing per 1 transmitted whitelist). The uniqueness lies in the fact that corePath merges with node_modules and the passed path is guaranteed to return with / at the end, which best makes it clear to the path stack handler what to do.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.connections.addDependencyAndPathsToWhiteList(
	pass,
	//process.cwd() + "/node_modules/node-fetch/", process.cwd() + "/index.js"
	["node-fetch", "index.js"],
	//already used
	["node_modules/request/", "index.js"]
);

```

### NRS.*.addDependencyPathAndProjectPathsToWhiteList: (tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]) => boolean
The same as addDependencyAndPathsToWhiteList, only without the / at the end.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.connections.addDependencyPathAndProjectPathsToWhiteList(
	pass,
	["node-fetch/lib/index.js", "index.js"],
	["node_modules/request/request.js", "index.js"]
);

```

## NRS.connections

### NRS.connections.block: (tryPass: string, fullBlock?: boolean) => connectionsBlockAllow
Blocks all possible ways to make a request. If passed fullBlock=true-blocks functions without the ability to control rights.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.connections.block(pass);

const fetch = require("node-fetch");
fetch("http://www.example.com/"); // nothing will happen

```

### NRS.connections.allow: (tryPass: string) => connectionsBlockAllow
Rolls back the action of NRS.connections.block.

### NRS.connections.integrate*: (tryPass: string, fullBlock?: boolean) => boolean
The following methods block a specific native module:
* NRS.connections.integrateToNet
* NRS.connections.integrateToHttp
* NRS.connections.integrateToHttps
* NRS.connections.integrateToHttp2
* NRS.connections.integrateToHttpAgent
* NRS.connections.integrateToHttpClient
* NRS.connections.integrateToTls
* NRS.connections.integrateToTlsWrap

### NRS.connections.restore*: (tryPass: string) => boolean
The following methods restore a specific native module:
* NRS.connections.restoreNet
* NRS.connections.restoreHttp
* NRS.connections.restoreHttps
* NRS.connections.restoreHttp2
* NRS.connections.restoreHttpAgent
* NRS.connections.restoreHttpClient
* NRS.connections.restoreTls
* NRS.connections.restoreTlsWrap

### NRS.connections.$tls|$net|$http|$https|$http2.get: (tryPass: string, propName: string): any
Returns the original properties of native modules, as well as the integration status and possibly some other properties. See src/connections/store.js to understand the full possible values of propName.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);
NRS.connections.integrateToHttp(pass);

const httpRequest = NRS.connections.$http.get(pass, "request");

//this request will be resolved
httpRequest({
	host: "www.example.com"
}, () => {});

```

## NRS.fs

### NRS.fs.block: (tryPass: string, fullBlock?: boolean) => [boolean, boolean]
Blocks all possible ways to modify the file system. NOTE: This does not apply to reading.

### NRS.fs.allow: (tryPass: string) => [boolean, boolean]
Rolls back the action of NRS.fs.block.

### NRS.fs.$fs|$fsPromises.get: (tryPass: string, propName: string): any
Similar to NRS.connections.$http|$https|...

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);
NRS.fs.block(pass);

const status = NRS.fs.$fs.get(pass, "status") // -> true
const writeFileSync = NRS.fs.$fs.get(pass, "writeFileSync");

```

## NRS.process

### NRS.process.block|blockBindingLinkedBindingAndDlopen: (tryPass: string, options?: processBlockBindingsOptions) => [boolean, boolean, boolean]
Blocks the process.binding, process._linkedBinding, and process.dlopen, since they can be used to connect non-standard ways to perform a prohibited action. Unlike other blocking methods, it accepts a one-time setting of whitelists via the options argument.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.process.block(pass, {

	returnProxyInsteadThrow: true,
	whiteLists: [{

		type: "project",
		list: [

			"src/main.js",
			"bin/index.js"

		]

	}],

});

```

### NRS.process.allow|allowBindingLinkedBindingAndDlopen: (tryPass: string) => [boolean, boolean, boolean]
Rolls back the action of NRS.process.block|blockBindingLinkedBindingAndDlopen.

### NRS.process.block*: (tryPass: string, options?: processBlockBindingsOptions) => boolean
The following methods block a separate process method:
* NRS.process.blockBinding
* NRS.process.blockLinkedBinding
* NRS.process.blockDlopen

### NRS.process.allow*: (tryPass: string) => boolean
The following methods restore a separate process method:
* NRS.process.allowBinding
* NRS.process.allowLinkedBinding
* NRS.process.allowDlopen

### NRS.child_process|dgram||worker_threads|cluster.block: (tryPass: string, fullBlock?: boolean) => boolean
Blocks a specific native module that may be a threat to bypass protection. For a better understanding of how these modules can bypass NRS protection, see tests/blocked|allowed/others/ .

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.worker_threads.block(pass);
NRS.cluster.block(pass);
//...

```

### NRS.child_process|dgram||worker_threads|cluster.allow: (tryPass: string) => boolean
Rolls back the action of NRS.child_process|dgram||worker_threads|cluster.block.

### NRS.process|child_process|dgram||worker_threads|cluster|timers|module.$fns: (tryPass: string, propName: string) => any
Similar to NRS.connections.$http|$https|... For more information see src/process|child_process|dgram||worker_threads|cluster|timers|module/store.js|thisStore.js .

## NRS.timers

### NRS.timers.changeMaxGetUniqFnNameRecursiveCalls: (tryPass: string, newValue: number) => boolean
Changes the local value of maxGetUniqFnNameRecursiveCalls to newValue. Used in the getUniqFnName logic to avoid maximum recursion. See more src/timers/integrate.js .

### NRS.timers.integrate: (tryPass: string) => timersBlockAllow
Puts traps on the following methods: _setImmediate_, _process.nextTick_, _setTimeout_, _setInterval_, _Promise.prototype.then_, _Promise.prototype.catch_, _EventEmitter.prototype.on_, _fs.readFile_, _fs.writeFile_. Why do you need this - see Troubleshooting->Problem with a sliced path stack.

### NRS.timers.restore: (tryPass: string) => timersBlockAllow
Rolls back the action of NRS.timers.integrate.

### NRS.timers.integrateTo*: (tryPass: string) => boolean
The following methods allow you to integrate the trap into a separate function:
* NRS.timers.integrateToImmediate
* NRS.timers.integrateToProcessNextTick
* NRS.timers.integrateToSetTimeout
* NRS.timers.integrateToSetInterval
* NRS.timers.integrateToPromiseThen
* NRS.timers.integrateToPromiseCatch
* NRS.timers.integrateToEventEmitterOn
* NRS.timers.integrateToFsReadFile
* NRS.timers.integrateToFsWriteFile

### NRS.timers.restore*: (tryPass: string) => boolean
The following methods allow you to remove the trap from a separate function:
* NRS.timers.restoreImmediate
* NRS.timers.restoreProcessNextTick
* NRS.timers.restoreSetTimeout
* NRS.timers.restoreSetInterval
* NRS.timers.restorePromiseThen
* NRS.timers.restorePromiseCatch
* NRS.timers.restoreEventEmitterOn
* NRS.timers.restoreFsReadFile
* NRS.timers.restoreFsWriteFile

### NRS.timers.reset: (tryPass: string, callback: () => any, type?: timersResetT) => boolean
Deletes a sequential chain of paths that were previously stored from the pathsStore, if any, and then calls callback. It is recommended to use such a reset from a separate file.

**For more understanding and specifics, see the last 2 tests with requestController in tests/index.js, as well as the following files: tests/allowed&blocked/connections/requestController.js and tests/allowed/connections/_requestWCReset.js**.

**Simple example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);
NRS.connections.block(pass);
NRS.timers.integrate(pass);

NRS.timers.reset(pass, () => {

	//...

}, "nextTick")

```

## NRS.module

### NRS.module.useSecureRequirePatch: (tryPass: string, whiteFilenames?: string[] | string) => boolean
Activates the require protection: dependencies will not be able to attach project files. whiteFilenames - an array of absolute paths to files that are not covered by the protected require. **Does not apply to the import system.**

**Example**:

```javascript

const NRS = require("node-rules-system");
const { join } = require("path");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.module.useSecureRequirePatch(
	pass,
	join( NRS.settings.$getCorePath(), "index.js" )
)

```

### NRS.module.useDependencyController: (tryPass: string, argsObject: dControllerArgsObjectT) => boolean
Allows you to control the dependencies of dependencies.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);

NRS.module.useDependencyController(pass, {

	"someDependency": ["<ownDependencies>", "<ownDevDependencies>", "someAdditionalDependency"],
	"someOtherDependency": ["depOne", "depTwo"],

})

```

### NRS.module.allowChangeAndUseTo: (tryPass: string, filename: string) => boolean
Allows you to set a list of modules that can modify the Module.wrap and call methods such as createRequireFromPath. **Works only with any patch enabled.**

### NRS.module.offSecureRequirePatch: (tryPass: string) => [boolean, boolean]
Rolls back the action of NRS.module.useSecureRequirePatch.

### NRS.module.offDependencyController: (tryPass: string) => [boolean, boolean]
Rolls back the action of NRS.module.useDependencyController.

### NRS.module.restoreOriginalRequire: (tryPass: string) => [boolean, boolean, boolean]
Rolls back the action of NRS.module.useSecureRequirePatch and NRS.module.useDependencyController.

### NRS.module.getWrapper: (tryPass: string) => [string, string]
Returns a wrapper array for the modified Module.wrap, which can be changed. **NOT A COPY**.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);
NRS.module.useSecureRequirePatch(pass);

const wrapper = NRS.module.getWrapper(pass);
wrapper[0] = `(function (exports, require, module, __filename, __dirname) { 
console.log(123);`

```

### NRS.module.beforeWrapper|beforeSecureRequire|beforeMainCode|afterMainCode|afterWrapper: (tryPass: string, id: string, code: string) => boolean
Methods for controlling the locations of the modified Module. wrap. About the sequence, see [here](https://github.com/StormExecute/node-rules-system/blob/3cd8afbbf7d4f3851c32b266eec56787feb0499d/src/module/wrap.js#L592).

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);
NRS.module.useSecureRequirePatch(pass);

NRS.module.beforeMainCode(pass, "identifier", `
console.log("Hello world!");
const uniqVariable[[NRS_RANDOM_FN_SALT]] = "additional features of the NRS!";
`)

```

### NRS.module.beforeWrapperRemove|beforeSecureRequireRemove|beforeMainCodeRemove|afterMainCodeRemove|afterWrapperRemove: (tryPass: string, id: string) => boolean
Rolls back the action of NRS.module.beforeWrapper|beforeSecureRequire|beforeMainCode|afterMainCode|afterWrapper.

**Example**:

```javascript

const NRS = require("node-rules-system");
const pass = "yourPassword" + Math.random();
NRS.init(pass);
NRS.module.useSecureRequirePatch(pass);

NRS.module.beforeMainCodeRemove(pass, "identifier")

```

<a name="contacts"></a>
# Contacts

**Yandex Mail** - vladimirvsevolodovi@yandex.ru

**Github** - https://github.com/StormExecute/

# Platforms

**Github** - https://github.com/StormExecute/node-rules-system/

**NPM** - https://www.npmjs.com/package/node-rules-system/

# License

**MIT** - https://mit-license.org/

[npm-url]: https://www.npmjs.com/package/node-rules-system
[npm-image]: https://img.shields.io/npm/v/node-rules-system.svg