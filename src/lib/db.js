const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

let connection = null;

module.exports.connect = (url) => new Promise((resolve, reject) => {
    MongoClient.connect(url, { promiseLibrary: Promise }, function(err, db) {
        if (err) { reject(err); return; };
        resolve(db);
        connection = db;
    });
});

module.exports.get = () => {
    if(!connection) {
        throw new Error('Call connect first!');
    }

    return connection;
}