const DbModel = require('../lib/DbModel');
const conf = require('config');

class TreeModel extends DbModel {
	constructor() {
		super();
	}
	
	async getByNodeName(nodeName) {
		const root = await this.find({ 'name': { $regex: `^${nodeName}$` }}, { _id: false }).toArray();

		if(root.length === 0) {
			return Promise.reject(`Can't find node by name "${nodeName}"`);
		}

		const rootLastTermIndex = root[0].name.lastIndexOf(conf.get('separator'));
		let subTree = await this.find({ 'name': { $regex: `^${nodeName}.*` }}, { _id: false }).toArray();

		if(rootLastTermIndex !== -1) {
			const idx = rootLastTermIndex + conf.get('separator').length;
			subTree = subTree.map(item => {
				item.name = item.name.slice(idx);
				return item;
			});
		}

		return subTree;
	}

	async getAll() {
		return this.find({}, { _id: false }).toArray();
	}
}

module.exports = new TreeModel();