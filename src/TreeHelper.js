const Promise = require('bluebird');
const conf = require('config');
const _ = require('lodash');
const winston = require('winston');
const db = require('./lib/db').get();
const tr = require('./TaxonomyReader');
const tm = require('./models/TreeModel');

async function makeNestedTree(data) {
	let levels = [{}];

	data.forEach(item => {
		const path = item.name.split(conf.get('separator'));
		const level = path.length;
		item.name = path.pop();
		
		levels.length = level;
		levels[level-1].children = levels[level-1].children || [];
		levels[level-1].children.push(item);
		levels[level] = item;
	});

	return levels[0].children;
}

module.exports.storeTree = async (id) => {
	const colSize = await tm.count();
	const rootId = id || conf.get('rootNodeId');

	if(colSize > 0 && !conf.get('db.forceUpdate')) {
		return Promise.reject('Collection already exists. Use config settings "db.forceUpdate = true".');
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
		return Promise.reject('Found an empty collection, please firstly fill it in.');
	}

	const flatTree = nodeName ? 
		await tm.getByNodeName(nodeName) : 
		await tm.getAll();
	const tree = await makeNestedTree(flatTree);

	return tree;
}