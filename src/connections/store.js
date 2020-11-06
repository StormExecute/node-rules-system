const $tls = {

	status: false,

	connect: null,
	socketProtoConnect: null,

};

const _tls = {

	status: false,

	connect: null,
	socketProtoConnect: null,

};

const $net = {

	status: false,

	connect: null,
	createConnection: null,

	SocketPrototypeConnect: null,
	StreamPrototypeConnect: null,

};

const $http = {

	status: false,

	Agent: null,
	globalAgent: null,

	ClientRequest: null,

	get: null,
	request: null,

	Client: null,
	createClient: null,

};

const _httpAgent = {

	status: false,

	Agent: null,
	globalAgent: null,

};

const _httpClient = {

	status: false,

	ClientRequest: null,

};

const $https = {

	status: false,

	Agent: null,
	globalAgent: null,

	get: null,
	request: null,

};

const $http2 = {

	status: false,

	connect: null,
	request: null,

};

module.exports = {

	$tls,
	$net,
	$http,
	$https,
	$http2,

	_tls,
	_httpAgent,
	_httpClient,

};