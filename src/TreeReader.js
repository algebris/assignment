const Promise = require('bluebird');
const conf = require('config');
const _ = require('lodash');
const winston = require('winston');
const tr = require('./TaxonomyReader');
const tm = require('./models/TreeModel');
const errors = require('./lib/errors');

module.exports.storeTree = async (id) => {
	const colSize = await tm.count();
	const rootId = id || conf.get('rootNodeId');

	if(colSize > 0 && !conf.get('db.forceUpdate')) {
		throw errors.updateDataError('Collection already exists. Use config settings "db.forceUpdate = true".');
	}

	// fetch data from remote web-site
	winston.profile('fetch');
	let data = await tr.getLinearTree(rootId);
	winston.profile('fetch');
	
	// sorting fetched data before insert into DB
	data = _.sortBy(data, ['name']);

	return tm.insertMany(data);
}

module.exports.getTree = async (nodeName) => {
	const colSize = await tm.count();

	if(colSize === 0) {
		throw errors.resourceNotFoundError('Found an empty collection, please firstly fill it in.');
	}

	const flatTree = nodeName ? 
		await tm.getAllByNodeName(nodeName) : 
		await tm.getAll();
	
	return tm.makeNestedTree(flatTree, 'name');
}
