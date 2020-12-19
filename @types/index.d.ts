interface plainObjectT {

	[key: string]: any

}

type argumentsType = any[] | plainObjectT;

import events = require("events");

interface defaultLogObj {

	type: string,
	callerPaths: string[],

}

type defaultLogObjWithGrants = defaultLogObj & {

	grantRights: boolean

}

type defaultLogObjWithArgsAndGrants = defaultLogObjWithGrants & {

	args: argumentsType

};

type logsSetPasswordT = defaultLogObj & {

	where: string

};

type logsWrongChangePasswordT = defaultLogObj & {

	wrongLastPass: string

};

type logsWrongPasswordT = defaultLogObjWithGrants & {

	where:
		"getSettings" |
		"useIsCallerPathInsteadTrustedAllowList" | "setChangeModuleRandomSignInterval" |
		"throwIfWrongPassword" | "dontThrowIfWrongPassword" | "setCorePath" |

		"allowChildProcess" | "blockChildProcess" | "allowCluster" | "blockCluster" |

		"allowTls" | "allowTlsWrap" | "allowNet" | "allowHttpAgent" | "allowHttpClient" |
		"allowHttp" | "allowHttps" | "allowHttp2" | "allowConnections" |

		"blockTls" | "blockTlsWrap" | "blockNet" | "blockHttpAgent" | "blockHttpClient" |
		"blockHttp" | "blockHttps" | "blockHttp2" | "blockConnections" |

		"allowDgram" | "blockDgram" | "allowFs" | "blockFs" |

		"beforeWrapper" | "beforeSecureRequire" | "beforeMainCode" |
		"afterMainCode" | "afterWrapper" |

		"beforeWrapperRemove" | "beforeSecureRequireRemove" | "beforeMainCodeRemove" |
		"afterMainCodeRemove" | "afterWrapperRemove" |

		"getWrapper" | "useDependencyController" | "useSecureRequirePatch" |
		"restoreOriginalRequire" | "offSecureRequirePatch" | "offDependencyController" |

		"allowProcessBinding" | "allowProcessLinkedBinding" | "allowProcessDlopen" |
		"allowProcessBindingLinkedBindingAndDlopen" |

		"blockProcessBinding" | "blockProcessLinkedBinding" | "blockProcessDlopen" |
		"blockProcessBindingLinkedBindingAndDlopen" |

		"changeMaxGetUniqFnNameRecursiveCalls" |

		"integrateTimers" | "integrateTimersAll" | "timersReset" |
		"restoreTimers" | "restoreTimersAll" |

		"allowWorkerThreads" | "blockWorkerThreads" |

		"fullSecure" |

		"get" |

		"startRecordLogs" | "stopRecordLogs" | "getAllLogs" |  "getLogsEmitter" |

		"secureSession" | "session" |

		"setSecure" |

		"addCustomPathsToWhiteList" | "addPathsToWhiteList" |
		"addDependencyAndPathsToWhiteList" | "addDependencyPathAndProjectPathsToWhiteList"

	,

	//setChangeModuleRandomSignInterval
	ms?: number,
	immediately?: boolean,

	//setCorePath
	path?: string,

	//blockX
	fullBlock?: boolean,

	options?: processBlockBindingsOptions,

	//changeMaxGetUniqFnNameRecursiveCalls
	newValue?: number,

	//integrateTimers, restoreTimers
	prop?: string,

	//fullSecure & settings.useIsCallerPathInsteadTrustedAllowList
	status?: string,

	//get
	propName?: string,

	//secureSession
	args?: whiteListFunctionalityArgsNeedReal[],

	//setSecure
	secureElements?: string[],

	//whiteListMethods
	argsArray?: whiteListFunctionalityArgsNeedReal[],

};

type logsCallFnT = defaultLogObjWithArgsAndGrants & {

	fn: string,
	calledAsClass: boolean,

};

type logsCallObjT = defaultLogObjWithArgsAndGrants & {

	obj: string,
	prop: string,

};

type logsCallProtoFnT = defaultLogObjWithArgsAndGrants & {

	protoFn: string,

};

type logsCallFromSecureSessionT = defaultLogObjWithArgsAndGrants & {

	NRSFnName: string,
	NRSFnPropName: string,

};

type logsGet = defaultLogObjWithGrants & {

	propName: string

};

type logsAddToWhiteList = defaultLogObjWithArgsAndGrants & {

	$corePath: string,
	whiteList: string,

};

type logsUseModuleFns = defaultLogObjWithArgsAndGrants & {

	type: "Module.prototype.load" | "Module._extensions['.js']" |
		"Module._load" | "Module.createRequireFromPath" | "Module.createRequire"

};

type logsUpModuleWrap = defaultLogObjWithGrants & {

	type: "change" | "customCode",

	filename: string,
	value: (...args: any[]) => string | any,

};

type logMessage = defaultLogObj & {

	grantRights?: boolean,

	args?: argumentsType | whiteListFunctionalityArgsNeedReal[],

	where: string,

	wrongLastPass: string,

	ms?: number,

	immediately?: boolean,

	path?: string,

	fullBlock?: boolean,

	options?: processBlockBindingsOptions,

	newValue?: number,

	prop?: string,

	status?: string,

	propName?: string,

	secureElements?: string[],

	argsArray?: whiteListFunctionalityArgsNeedReal[],

	fn?: string,

	calledAsClass?: boolean,

	obj?: string,

	protoFn?: string,

	NRSFnName?: string,

	NRSFnPropName?: string,

	$corePath?: string,

	whiteList?: string,

	type?: string,

	value?: string,

};

declare class logs extends events.EventEmitter {

	onMany(eventsArray: string[], listener: (...args: any[]) => void): this;

	on(event: "*", listener: (logObj: logMessage) => void): this;

	on(event: "setPassword", listener: (logObj: logsSetPasswordT) => void): this;

	on(event: "passwordAlready", listener: (logObj: defaultLogObj) => void): this;
	on(event: "changePassword", listener: (logObj: defaultLogObj) => void): this;

	on(event: "wrongChangePassword", listener: (logObj: logsWrongChangePasswordT) => void): this;
	on(event: "wrongPassword", listener: (logObj: logsWrongPasswordT) => void): this;

	on(event: "callFn", listener: (logObj: logsCallFnT) => void): this;
	on(event: "callObj", listener: (logObj: logsCallObjT) => void): this;
	on(event: "callProtoFn", listener: (logObj: logsCallProtoFnT) => void): this;

	on(event: "callFromBlockBindings", listener: (logObj: logsCallFnT) => void): this;
	on(event: "callFromSecureSession", listener: (logObj: logsCallFromSecureSessionT) => void): this;
	on(event: "callFromFsPromisesOpen", listener: (logObj: defaultLogObjWithArgsAndGrants) => void): this;

	on(event: "get", listener: (logObj: logsGet) => void): this;

	on(event: "addToWhiteList", listener: (logObj: logsAddToWhiteList) => void): this;

	on(event: "useModuleFns", listener: (logObj: logsUseModuleFns) => void): this;
	on(event: "upModuleWrap", listener: (logObj: logsUpModuleWrap) => void): this;

}

interface $sessionConfigs {

	returnSession: boolean,

}

import tls = require('tls');
import net = require("net");
import http = require("http");
import http2 = require("http2");
import https = require("https");

interface whiteListFunctionalityCustomHandlerDefaults {

	callerPaths?: string[],
	callerFnName?: string,

	args?: argumentsType,

}

type callFnT = "callFn";
type callObjT = "callObj";
type callPFnT = "callProtoFn";
type callSST = "callFromSecureSession";
type callBBT = "callFromBlockBindings";
type callFsT = "callFromFsPromisesOpen";

type whiteListFunctionalityCustomHandlerByFn =
	(by: callFnT, args: whiteListFunctionalityCustomHandlerDefaults & {

		origin?: typeof tls | typeof net | typeof http | typeof http2 | typeof https,
		method?: string,

	}) => boolean;

type whiteListFunctionalityCustomHandlerByObj =
	(by: callObjT, args: whiteListFunctionalityCustomHandlerDefaults & {

		origin?: http.Agent,

		objName?: string,
		objProp?: string,

	}) => boolean;

type whiteListFunctionalityCustomHandlerByProtoFn =
	(by: callPFnT, args: whiteListFunctionalityCustomHandlerDefaults & {

		origin?: typeof net.Socket.prototype.connect | typeof tls.TLSSocket.prototype.connect,

		protoFn?: string,

	}) => boolean;

type whiteListFunctionalityCustomHandlerBySession =
	(by: callSST, args: whiteListFunctionalityCustomHandlerDefaults & {

		NRSFnName: string,
		NRSFnPropName: string,

	}) => boolean;

type whiteListFunctionalityCustomHandlerByBindings =
	(by: callBBT, args: whiteListFunctionalityCustomHandlerDefaults & {

		fn: string,

	}) => boolean;

type whiteListFunctionalityCustomHandlerByFs =
	(by: callFsT, args: whiteListFunctionalityCustomHandlerDefaults) => boolean;

type whiteListFunctionalityCustomHandler =
		whiteListFunctionalityCustomHandlerByFn
		|
		whiteListFunctionalityCustomHandlerByObj
		|
		whiteListFunctionalityCustomHandlerByProtoFn
		|
		whiteListFunctionalityCustomHandlerBySession
		|
		whiteListFunctionalityCustomHandlerByBindings
		|
		whiteListFunctionalityCustomHandlerByFs;

type whiteListFunctionalityArgsNeed = string | string[] | {

	paths?: string | string[],
	blackPaths?: string | string[],
	whiteListDomains?: string | string[],
	blackListDomains?: string | string[],

	callerFnName?: string,

	onlyWhited?: boolean,
	everyWhite?: boolean,
	fullIdentify?: boolean,

} | {

	customHandler: whiteListFunctionalityCustomHandler,

}

type whiteListFunctionalityArgsFunction = ({}?: {

	dep: (path: string) => string,
	depD: (path: string) => string,
	core: (path: string) => string,
	coreD: (path: string) => string,

	$corePath: string,
	findCorePath: (path?: string, lastPath?: string) => string

}) => whiteListFunctionalityArgsNeed;

type whiteListFunctionalityArgsNeedReal = whiteListFunctionalityArgsNeed | whiteListFunctionalityArgsFunction;

interface standardWhiteListMethodsWithPassword {

	addCustomPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addDependencyAndPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addDependencyPathAndProjectPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,

}

interface standardWhiteListMethodsWithoutPassword {

	addCustomPathsToWhiteList(...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addPathsToWhiteList(...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addDependencyAndPathsToWhiteList(...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addDependencyPathAndProjectPathsToWhiteList(...args: whiteListFunctionalityArgsNeedReal[]): boolean,

}

interface getFnWithPassword {

	get(tryPass: string, propName: string): any

}

interface getFnWithoutPassword {

	get(propName: string): any

}

interface standardBlockAllowWithPassword {

	block(tryPass: string, fullBlock?: boolean): boolean,
	allow(tryPass: string): boolean,

}

interface standardBlockAllowWithoutPassword {

	block(fullBlock?: boolean): boolean,
	allow(): boolean,

}

type standardMethodsWithPassword = {
	$fns: getFnWithPassword
} & standardWhiteListMethodsWithPassword & standardBlockAllowWithPassword;

type standardMethodsWithoutPassword = {
	$fns: getFnWithoutPassword
} & standardWhiteListMethodsWithoutPassword & standardBlockAllowWithoutPassword;

type connectionsBlockAllow = [

	boolean,

	boolean,
	boolean,

	boolean,

	boolean,
	boolean,

	boolean,
	boolean,

];

type connectionsWithPassword = {

	$tls: getFnWithPassword,
	$net: getFnWithPassword,
	$http: getFnWithPassword,
	$https: getFnWithPassword,
	$http2: getFnWithPassword,

	block(tryPass: string, fullBlock?: boolean): connectionsBlockAllow,
	allow(tryPass: string): connectionsBlockAllow,

	integrateToNet(tryPass: string, fullBlock?: boolean): boolean,
	integrateToHttp(tryPass: string, fullBlock?: boolean): boolean,
	integrateToHttps(tryPass: string, fullBlock?: boolean): boolean,
	integrateToHttp2(tryPass: string, fullBlock?: boolean): boolean,

	integrateToHttpAgent(tryPass: string, fullBlock?: boolean): boolean,
	integrateToHttpClient(tryPass: string, fullBlock?: boolean): boolean,
	integrateToTls(tryPass: string, fullBlock?: boolean): boolean,
	integrateToTlsWrap(tryPass: string, fullBlock?: boolean): boolean,

	restoreNet(tryPass: string): boolean,
	restoreHttp(tryPass: string): boolean,
	restoreHttps(tryPass: string): boolean,
	restoreHttp2(tryPass: string): boolean,

	restoreHttpAgent(tryPass: string): boolean,
	restoreHttpClient(tryPass: string): boolean,
	restoreTls(tryPass: string): boolean,
	restoreTlsWrap(tryPass: string): boolean,

} & standardWhiteListMethodsWithPassword;

type connectionsWithoutPassword = {

	$tls: getFnWithoutPassword,
	$net: getFnWithoutPassword,
	$http: getFnWithoutPassword,
	$https: getFnWithoutPassword,
	$http2: getFnWithoutPassword,

	block(fullBlock?: boolean): connectionsBlockAllow,
	allow(): connectionsBlockAllow,

	integrateToNet(fullBlock?: boolean): boolean,
	integrateToHttp(fullBlock?: boolean): boolean,
	integrateToHttps(fullBlock?: boolean): boolean,
	integrateToHttp2(fullBlock?: boolean): boolean,

	integrateToHttpAgent(fullBlock?: boolean): boolean,
	integrateToHttpClient(fullBlock?: boolean): boolean,
	integrateToTls(fullBlock?: boolean): boolean,
	integrateToTlsWrap(fullBlock?: boolean): boolean,

	restoreNet(): boolean,
	restoreHttp(): boolean,
	restoreHttps(): boolean,
	restoreHttp2(): boolean,

	restoreHttpAgent(): boolean,
	restoreHttpClient(): boolean,
	restoreTls(): boolean,
	restoreTlsWrap(): boolean,

} & standardWhiteListMethodsWithoutPassword;

type fsWithPassword = {

	$fs: getFnWithPassword,
	$fsPromises: getFnWithPassword,

	block(tryPass: string, fullBlock?: boolean): [boolean, boolean],
	allow(tryPass: string): [boolean, boolean],

} & standardWhiteListMethodsWithPassword;

type fsWithoutPassword = {

	$fs: getFnWithoutPassword,
	$fsPromises: getFnWithoutPassword,

	block(fullBlock?: boolean): [boolean, boolean],
	allow(): [boolean, boolean],

} & standardWhiteListMethodsWithoutPassword;

interface processBlockBindingOptionsWL {

	type: string,
	list: whiteListFunctionalityArgsNeedReal[]

}

interface processBlockBindingsOptions {

	fullBlock?: boolean,

	returnProxyInsteadThrow?: boolean,
	whiteLists?: processBlockBindingOptionsWL[]

}

type processWithPassword = {

	blockBinding: (tryPass: string, options?: processBlockBindingsOptions) => boolean,
	blockLinkedBinding: (tryPass: string, options?: processBlockBindingsOptions) => boolean,
	blockDlopen: (tryPass: string, options?: processBlockBindingsOptions) => boolean,

	blockBindingLinkedBindingAndDlopen: (tryPass: string, options?: processBlockBindingsOptions) => [boolean, boolean, boolean],
	block: (tryPass: string, options?: processBlockBindingsOptions) => [boolean, boolean, boolean],

	allowBinding: (tryPass: string) => boolean,
	allowLinkedBinding: (tryPass: string) => boolean,
	allowDlopen: (tryPass: string) => boolean,

	allowBindingLinkedBindingAndDlopen: (tryPass: string) => [boolean, boolean, boolean],
	allow: (tryPass: string) => [boolean, boolean, boolean],

	$fns: getFnWithPassword,

}

type processWithoutPassword = {

	blockBinding: (options?: processBlockBindingsOptions) => boolean,
	blockLinkedBinding: (options?: processBlockBindingsOptions) => boolean,
	blockDlopen: (options?: processBlockBindingsOptions) => boolean,

	blockBindingLinkedBindingAndDlopen: (options?: processBlockBindingsOptions) => [boolean, boolean, boolean],
	block: (options?: processBlockBindingsOptions) => [boolean, boolean, boolean],

	allowBinding: () => boolean,
	allowLinkedBinding: () => boolean,
	allowDlopen: () => boolean,

	allowBindingLinkedBindingAndDlopen: () => [boolean, boolean, boolean],
	allow: () => [boolean, boolean, boolean],

	$fns: getFnWithoutPassword,

}

type timersBlockAllow = [

	boolean,
	boolean,

	boolean,
	boolean,

	boolean,
	boolean,

	boolean,

	boolean,
	boolean,

];

interface timersWithPassword {

	changeMaxGetUniqFnNameRecursiveCalls: (tryPass: string, newValue: number) => boolean,

	integrateToImmediate: (tryPass: string) => boolean,
	integrateToProcessNextTick: (tryPass: string) => boolean,

	integrateToSetTimeout: (tryPass: string) => boolean,
	integrateToSetInterval: (tryPass: string) => boolean,

	integrateToPromiseThen: (tryPass: string) => boolean,
	integrateToPromiseCatch: (tryPass: string) => boolean,

	integrateToEventEmitterOn: (tryPass: string) => boolean,

	integrateToFsReadFile: (tryPass: string) => boolean,
	integrateToFsWriteFile: (tryPass: string) => boolean,

	integrate: (tryPass: string) => timersBlockAllow,

	restoreImmediate: (tryPass: string) => boolean,
	restoreProcessNextTick: (tryPass: string) => boolean,

	restoreSetTimeout: (tryPass: string) => boolean,
	restoreSetInterval: (tryPass: string) => boolean,

	restorePromiseThen: (tryPass: string) => boolean,
	restorePromiseCatch: (tryPass: string) => boolean,

	restoreEventEmitterOn: (tryPass: string) => boolean,

	restoreFsReadFile: (tryPass: string) => boolean,
	restoreFsWriteFile: (tryPass: string) => boolean,

	restore: (tryPass: string) => timersBlockAllow,

	reset: (tryPass: string, callback: () => any, type: string) => boolean,

	$fns: getFnWithPassword,

}

interface timersWithoutPassword {

	changeMaxGetUniqFnNameRecursiveCalls: (newValue: number) => boolean,

	integrateToImmediate: () => boolean,
	integrateToProcessNextTick: () => boolean,

	integrateToSetTimeout: () => boolean,
	integrateToSetInterval: () => boolean,

	integrateToPromiseThen: () => boolean,
	integrateToPromiseCatch: () => boolean,

	integrateToEventEmitterOn: () => boolean,

	integrateToFsReadFile: () => boolean,
	integrateToFsWriteFile: () => boolean,

	integrate: () => timersBlockAllow,

	restoreImmediate: () => boolean,
	restoreProcessNextTick: () => boolean,

	restoreSetTimeout: () => boolean,
	restoreSetInterval: () => boolean,

	restorePromiseThen: () => boolean,
	restorePromiseCatch: () => boolean,

	restoreEventEmitterOn: () => boolean,

	restoreFsReadFile: () => boolean,
	restoreFsWriteFile: () => boolean,

	restore: () => timersBlockAllow,

	reset: (callback: () => any, type: string) => boolean,

	$fns: getFnWithoutPassword,

}

interface dControllerArgsObjectT {

	[key: string]: string[] | string,

}

interface moduleWithPassword {

	beforeWrapper: (tryPass: string, id: string, code: string) => boolean,
	beforeSecureRequire: (tryPass: string, id: string, code: string) => boolean,
	beforeMainCode: (tryPass: string, id: string, code: string) => boolean,

	afterMainCode: (tryPass: string, id: string, code: string) => boolean,
	afterWrapper: (tryPass: string, id: string, code: string) => boolean,

	beforeWrapperRemove: (tryPass: string, id: string) => boolean,
	beforeSecureRequireRemove: (tryPass: string, id: string) => boolean,
	beforeMainCodeRemove: (tryPass: string, id: string) => boolean,

	afterMainCodeRemove: (tryPass: string, id: string) => boolean,
	afterWrapperRemove: (tryPass: string, id: string) => boolean,

	getWrapper: (tryPass: string) => [string, string],

	useSecureRequirePatch: (tryPass: string, whiteFilenames?: string[] | string) => boolean,
	useDependencyController: (tryPass: string, argsObject: dControllerArgsObjectT) => boolean,

	offSecureRequirePatch: (tryPass: string) => [boolean, boolean],
	offDependencyController: (tryPass: string) => [boolean, boolean],

	restoreOriginalRequire: (tryPass: string) => [boolean, boolean, boolean],

}

interface moduleWithoutPassword {

	beforeWrapper: (id: string, code: string) => boolean,
	beforeSecureRequire: (id: string, code: string) => boolean,
	beforeMainCode: (id: string, code: string) => boolean,

	afterMainCode: (id: string, code: string) => boolean,
	afterWrapper: (id: string, code: string) => boolean,

	beforeWrapperRemove: (id: string) => boolean,
	beforeSecureRequireRemove: (id: string) => boolean,
	beforeMainCodeRemove: (id: string) => boolean,

	afterMainCodeRemove: (id: string) => boolean,
	afterWrapperRemove: (id: string) => boolean,

	getWrapper: () => [string, string],

	useSecureRequirePatch: (whiteFilenames?: string[] | string) => boolean,
	useDependencyController: (argsObject: dControllerArgsObjectT) => boolean,

	offSecureRequirePatch: () => [boolean, boolean],
	offDependencyController: () => [boolean, boolean],

	restoreOriginalRequire: () => [boolean, boolean, boolean],

}

type secureReturn = [

	connectionsBlockAllow,
	[boolean, boolean],

	[boolean, boolean, boolean],

	boolean,
	boolean,
	boolean,
	boolean,

	timersBlockAllow

];

type secureSetReturn = secureReturn | (null | boolean | boolean[])[];

interface settingsStoreT {

	throwIfWrongPassword: boolean,
	changeModuleRandomSignInterval: number,
	useIsCallerPathInsteadTrustedAllowList: boolean,

}

interface sessionT {

	getConfigs: () => $sessionConfigs,
	setReturn: (newState: boolean) => boolean,

	getAllLogs(): Array<logMessage>,
	getLogsEmitter(): logs,

	startRecordLogs(): boolean,
	stopRecordLogs(): boolean,

	settings: {

		get(): settingsStoreT,

		useIsCallerPathInsteadTrustedAllowList(status: boolean): boolean,

		setChangeModuleRandomSignInterval(ms: number, immediately?: boolean): boolean | number,

		throwIfWrongPassword(): boolean,
		dontThrowIfWrongPassword(): boolean,

		setCorePath(path: string): boolean,
		$getCorePath(): string,

	},

	fullSecure: (status: string) => secureReturn,
	enableFullSecure: () => secureReturn,
	disableFullSecure: () => secureReturn,

	setSecure: (status: string, secureElements: string[]) => secureSetReturn,
	setSecureEnable: (secureElements: string[]) => secureSetReturn,
	setSecureDisable: (secureElements: string[]) => secureSetReturn,

	connections: connectionsWithoutPassword,
	fs: fsWithoutPassword,

	process: processWithoutPassword,

	child_process: standardMethodsWithoutPassword,
	dgram: standardMethodsWithoutPassword,
	worker_threads: standardMethodsWithoutPassword,
	cluster: standardMethodsWithoutPassword,

	timers: timersWithoutPassword,
	module: moduleWithoutPassword,

	isReturnProxy(argument: any): boolean,

}

declare namespace NRS {

	function getAllLogs(tryPass: string): Array<logMessage>;
	function getLogsEmitter(tryPass: string): logs;

	function startRecordLogs(tryPass: string): boolean;
	function stopRecordLogs(tryPass: string): boolean;

	namespace settings {

		function get(tryPass: string): settingsStoreT;

		function useIsCallerPathInsteadTrustedAllowList(tryPass: string, status: boolean): boolean;

		function setChangeModuleRandomSignInterval(tryPass: string, ms: number, immediately?: boolean): boolean | number;

		function throwIfWrongPassword(tryPass: string): boolean;
		function dontThrowIfWrongPassword(tryPass: string): boolean;

		function setCorePath(tryPass: string, path: string): boolean;
		function $getCorePath(): string;

	}

	function init(newPassword: string): boolean;
	function reInit(lastPassword: string, newPassword: string): boolean;

	const session: (tryPass: string) => sessionT;
	const secureSession: (tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]) => sessionT;

	function fullSecure(tryPass: string): secureReturn;
	function enableFullSecure(tryPass: string): secureReturn;
	function disableFullSecure(tryPass: string): secureReturn;

	function setSecure(tryPass: string, status: string, secureElements: string[]): secureSetReturn;
	function setSecureEnable(tryPass: string, secureElements: string[]): secureSetReturn;
	function setSecureDisable(tryPass: string, secureElements: string[]): secureSetReturn;

	const connections: connectionsWithPassword;
	const fs: fsWithPassword;

	const process: processWithPassword;

	const child_process: standardMethodsWithPassword;
	const dgram: standardMethodsWithPassword;
	const worker_threads: standardMethodsWithPassword;
	const cluster: standardMethodsWithPassword;

	const timers: timersWithPassword;
	const module: moduleWithPassword;

	function isReturnProxy(argument: any): boolean;

}

export = NRS;