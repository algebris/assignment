const db = require('./db').get();
const conf = require('config');

// this stratum abstracts from different databases 
class DbModel {
	constructor(colName) {
		colName = colName || conf.get('db.collection');
		this.col = db.collection(colName);
	}

	count(query, opts) {
		return this.col.count(query, opts);
	}

	insertMany(data) {
		return this.col.remove()
			.then(() => this.col.insertMany(data));
	}

	findOne(query, proj) {
		return this.col.findOne(query, proj);
	}

	find(query, proj) {
		return this.col.find(query, proj);
	}
}

module.exports = DbModel;