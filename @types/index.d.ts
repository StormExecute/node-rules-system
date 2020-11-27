import events = require("events");
declare class logs extends events.EventEmitter {}

type callerPathsT = Array<string>;

interface logMessage {

	type: string,

	callerPaths: callerPathsT,

	[key: string]: any,

}

interface $sessionConfigs {

	returnSession: boolean,

}

type whiteListFunctionalityArgsNeed = string | string[] | {

	paths: string | string[],
	callerFnName?: string

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

interface standartWhiteListMethodsWithPassword {

	addCustomPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addDependencyAndPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,
	addDependencyPathAndProjectPathsToWhiteList(tryPass: string, ...args: whiteListFunctionalityArgsNeedReal[]): boolean,

}

interface standartWhiteListMethodsWithoutPassword {

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

interface standartBlockAllowWithPassword {

	block(tryPass: string, fullBlock?: boolean): boolean,
	allow(tryPass: string): boolean,

}

interface standartBlockAllowWithoutPassword {

	block(fullBlock?: boolean): boolean,
	allow(): boolean,

}

type standartMethodsWithPassword = {
	$fns: getFnWithPassword
} & standartWhiteListMethodsWithPassword & standartBlockAllowWithPassword;

type standartMethodsWithoutPassword = {
	$fns: getFnWithoutPassword
} & standartWhiteListMethodsWithoutPassword & standartBlockAllowWithoutPassword;

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

} & standartWhiteListMethodsWithPassword;

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

} & standartWhiteListMethodsWithoutPassword;

type fsWithPassword = {

	$fs: getFnWithPassword,
	$fsPromises: getFnWithPassword,

	block(tryPass: string, fullBlock?: boolean): [boolean, boolean],
	allow(tryPass: string): [boolean, boolean],

} & standartWhiteListMethodsWithPassword;

type fsWithoutPassword = {

	$fs: getFnWithoutPassword,
	$fsPromises: getFnWithoutPassword,

	block(fullBlock?: boolean): [boolean, boolean],
	allow(): [boolean, boolean],

} & standartWhiteListMethodsWithoutPassword;

interface processBlockBindingOptionsWL {

	type: string,
	list: whiteListFunctionalityArgsNeedReal[]

}

interface processBlockBindingOptions {

	returnProxyInsteadThrow?: boolean,
	whiteLists?: processBlockBindingOptionsWL[]

}

type processWithPassword = {

	blockBinding: (tryPass: string, options?: processBlockBindingOptions) => boolean,
	blockLinkedBinding: (tryPass: string, options?: processBlockBindingOptions) => boolean,
	blockDlopen: (tryPass: string, options?: processBlockBindingOptions) => boolean,

	blockBindingLinkedBindingAndDlopen: (tryPass: string, options?: processBlockBindingOptions) => [boolean, boolean, boolean],
	block: (tryPass: string, options?: processBlockBindingOptions) => [boolean, boolean, boolean],

	allowBinding: (tryPass: string) => boolean,
	allowLinkedBinding: (tryPass: string) => boolean,
	allowDlopen: (tryPass: string) => boolean,

	allowBindingLinkedBindingAndDlopen: (tryPass: string) => [boolean, boolean, boolean],
	allow: (tryPass: string) => [boolean, boolean, boolean],

	$fns: getFnWithPassword,

}

type processWithoutPassword = {

	blockBinding: (options?: processBlockBindingOptions) => boolean,
	blockLinkedBinding: (options?: processBlockBindingOptions) => boolean,
	blockDlopen: (options?: processBlockBindingOptions) => boolean,

	blockBindingLinkedBindingAndDlopen: (options?: processBlockBindingOptions) => [boolean, boolean, boolean],
	block: (options?: processBlockBindingOptions) => [boolean, boolean, boolean],

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

	$fns: getFnWithoutPassword,

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

interface sessionT {

	getConfigs: () => $sessionConfigs,
	setReturn: (newState: boolean) => boolean,

	getAllLogs(): Array<logMessage>,
	getLogsEmitter(): logs,

	startRecordLogs(): boolean,
	stopRecordLogs(): boolean,

	settings: {

		throwIfWrongPassword(): boolean,
		dontThrowIfWrongPassword(): boolean,
		setCorePath(path: string): boolean,

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

	child_process: standartMethodsWithoutPassword,
	dgram: standartMethodsWithoutPassword,
	worker_threads: standartMethodsWithoutPassword,
	cluster: standartMethodsWithoutPassword,

	timers: timersWithoutPassword,

	isReturnProxy(argument: any): boolean,

}

declare namespace NRS {

	function getAllLogs(tryPass: string): Array<logMessage>;
	function getLogsEmitter(tryPass: string): logs;

	function startRecordLogs(tryPass: string): boolean;
	function stopRecordLogs(tryPass: string): boolean;

	namespace settings {

		function throwIfWrongPassword(tryPass: string): boolean;
		function dontThrowIfWrongPassword(tryPass: string): boolean;
		function setCorePath(tryPass: string, path: string): boolean;

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

	const child_process: standartMethodsWithPassword;
	const dgram: standartMethodsWithPassword;
	const worker_threads: standartMethodsWithPassword;
	const cluster: standartMethodsWithPassword;

	const timers: timersWithPassword;

	function isReturnProxy(argument: any): boolean;

}

export = NRS;