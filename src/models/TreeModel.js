const DbModel = require('../lib/DbModel');
const conf = require('config');

class TreeModel extends DbModel {
	constructor() {
		super();
		this.sep = conf.get('separator');
	}
	
	async getAllByNodeName(nodeName) {
		const _root = await this.getRootNode(nodeName);

		if(_root.length === 0) {
			return Promise.reject(`Can't find node by name "${nodeName}"`);
		}

		let subTree = await this.find({ 'name': { $regex: `^${nodeName}.*` }});

		return this.chopPrefixes(subTree, _root[0].name);
	}

	async getAll() {
		return this.find({});
	}

	chopPrefixes(data, node) {
		const rootLastTermIndex = node.lastIndexOf(this.sep);

		if(rootLastTermIndex !== -1) {
			const idx = rootLastTermIndex + this.sep.length;
			data = data.map(item => {
				if(item.name.length !== rootLastTermIndex) {
					item.name = item.name.slice(idx);
				}
				return item;
			});
		}
		return data;
	}

	async getChildren(nodeName, includeRoot) {
		const _root = await this.getRootNode(nodeName);
		nodeName = nodeName || _root[0].name;

		if(_root.length === 0) {
			return Promise.reject(`Can't find node by name "${nodeName}"`);
		}
		const tsep = conf.get('separator').trim();
		let children = await this.find({ 'name': { $regex: `^${nodeName}${this.sep}[^${tsep}]*$`}});
		children = this.chopPrefixes(children, nodeName + this.sep);
		
		if(includeRoot) {
			const r = this.chopPrefixes(_root, nodeName);
			children.unshift(r[0]);
		}

		return children;
	}

	async getRootNode(nodeName) {
		const _root = nodeName ? 
			this.find({ 'name': { $regex: `^${nodeName}$` }}) :
			[ await this.findOne() ];
		return _root;
	}
}

module.exports = new TreeModel();