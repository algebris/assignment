const conf = require('config');
const Promise = require('bluebird');
const HttpXmlReader = require('./HttpXmlReader');

class TaxonomyReader extends HttpXmlReader {
	constructor() {
		super();
		this.tree = [];
	}

	getNodeMeta(node) {
		const t = conf.get('tagsDict');
		return {
			id: node[t.id],
			size: parseInt(node[t.size], 10) - 1,
			name: node[t.name]
		};
	}

	async getNode(nodeId) {
		let result = [];
		const t = conf.get('tagsDict');

		const response = await this.request(nodeId);
		const rootNode = response(`${t.tag}[${t.id}=${nodeId}]`);
		const nodeChildren = rootNode.children()
			.each((idx, elem) =>
				result.push(this.getNodeMeta(elem.attribs))
			);
		console.log('| ', rootNode[0].attribs.words);
		
		return [ this.getNodeMeta(rootNode[0].attribs), result ];
	}

	async getLinearTree(nodeId) {
		return await this.makeLinearTree(nodeId)
			.then(() => this.tree);
	}

	async makeLinearTree(nodeId, name) {
		let queue = [];
		let path = name || [];
		
		let node = await this.getNode(nodeId);
		const rootItem = node.shift();

		if(this.tree.length === 0) {
			this.tree.push({ name: rootItem.name, size: rootItem.size });
			path.push(rootItem.name);
		}
		
		node[0].forEach(item => {
			const namePath = path.concat(item.name).join(conf.get('separator'));
			this.tree.push({ name: namePath, size: item.size });

			if(item.size > 0) {
				queue.push(this.makeLinearTree(item.id, path.concat(item.name)));
			}
		});

		return Promise.all(queue);
	}
}

module.exports = new TaxonomyReader();