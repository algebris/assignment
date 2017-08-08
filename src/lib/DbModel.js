const db = require('./db').get();
const conf = require('config');

// this stratum abstracts from different databases 
class DbModel {
	constructor(colName) {
		this.colName = colName || conf.get('db.collection');
		this.proj = { _id: false };
		this.col = this._init();
	}

	async _init() {
		const dbh = await db;
		return dbh.collection(this.colName);
	}

	async count(query, opts) {
		const c = await this.col;
		return c.count(query, opts);
	}

	async insertMany(data) {
		const c = await this.col;
		return c.remove()
			.then(() => c.insertMany(data));
	}

	async findOne(query, proj) {
		const c = await this.col;
		proj = Object.assign(this.proj, proj);
		return c.findOne(query, proj);
	}

	async find(query, proj) {
		const c = await this.col;
		proj = Object.assign(this.proj, proj);
		return c.find(query, proj).toArray();
	}
}

module.exports = DbModel;