const Promise = require('bluebird');
const conf = require('config');
const _ = require('lodash');
const winston = require('winston');
const db = require('./db').get();
const tr = require('./TaxonomyReader');

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

module.exports.makeNestedTree = makeNestedTree;

module.exports.storeTree = async () => {
	const colName = conf.get('db.collection');
	const colSize = await db.collection(colName).count();

	if(colSize > 0 || !conf.get('db.forceUpdate')) {
		return Promise.reject('Collection already exists. Use config settings "db.forceUpdate = true".');
	}
	// fetch data from remote web-site
	winston.profile('fetch');
	let data = await tr.getLinearTree(conf.get('rootNodeId'));
	winston.profile('fetch');
	
	// sorting fetched data before insert into DB
	data = _.sortBy(data, ['name']);

	const col = await db.createCollection(colName);
	return col.insertMany(data);
}

module.exports.getSubtree = async (nodeName) => {
	const colName = conf.get('db.collection');
	const col = db.collection(colName);
	const colSize = await col.count();

	if(colSize === 0) {
		return Promise.reject('Found an empty collection, please firstly fill it in.');
	}

	const root = nodeName ?
		await col.find({ 'name': { $regex: `^${nodeName}$` }}, { _id: false }).toArray() :
		[ await col.findOne() ];

	const rootLastTermIndex = root[0].name.lastIndexOf(conf.get('separator'));

	if(root.length === 0) {
		return Promise.reject(`Can't find node: "${nodeName}"`);
	}

	let subTree = nodeName ? 
		await col.find({ 'name': { $regex: `^${nodeName}.*` }}, { _id: false }).toArray() :
		await col.find({}, { _id: false }).toArray();
	
	if(rootLastTermIndex !== -1) {
		const idx = rootLastTermIndex + conf.get('separator').length;
		subTree = subTree.map(item => {
			item.name = item.name.slice(idx);
			return item;
		});
	}

	const tree = await makeNestedTree(subTree);

	return tree;
}