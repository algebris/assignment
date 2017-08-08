const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const conf = require('config');

let connection = null;

async function connect(url) {
	url = url || conf.get('db.url');
    connection = await MongoClient.connect(url, { promiseLibrary: Promise });
    return connection;
}

module.exports.connect = connect;

module.exports.get = function() {
	return connection ? connection : connect();
}