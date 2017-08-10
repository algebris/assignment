const HTTPStatus = require('http-status');
const {ErrorModel, CustomError} = require('./error-model');

module.exports.retrieveDataError = function retrieveDataError(message, originalError) {
	return new CustomError(
		HTTPStatus.INTERNAL_SERVER_ERROR,
		'error.msg.unknown.error.while.retrieving.data',
		message,
		originalError
	);
};

module.exports.unknownError = function unknownError(originalError) {
	return new CustomError(
		HTTPStatus.INTERNAL_SERVER_ERROR,
		'error.msg.unknownError',
		'Unknown error',
		originalError
	);
};

module.exports.updateDataError = function retrieveDataError(message, originalError) {
	return new CustomError(
		HTTPStatus.INTERNAL_SERVER_ERROR,
		'error.msg.unknown.error.while.updating.data',
		message,
		originalError
	);
};

module.exports.resourceNotFoundError = function resourceNotFoundError(message, originalError) {
	return new CustomError(
		HTTPStatus.NOT_FOUND,
		'error.msg.resource.not.found',
		message,
		originalError
	);
};

module.exports.endpointNotFoundError = function endpointNotFoundError() {
	return new CustomError(
		HTTPStatus.NOT_FOUND,
		'error.msg.endpoint.not.found',
		'Endpoint does not exist'
	);
};