const conf = require('config');
const _ = require('lodash');
const tm = require('../models/TreeModel');

module.exports.getNodeChildren = (nodeName, includeRoot) => {
	return tm.getChildren(nodeName, includeRoot)
		.then(children => {
			children.map(item => {
				item.text = item.name;
				if (item.size === 0) {
					item.children = false;
					item.type = 'leaf';
				} else {
					item.children = true;
					item.type = 'folder';
				}
				return item;
			});
			
			let data = children;

			if(includeRoot) {
				data = children.shift();
				data.state = { 'opened':true };
				data.children = children;
				data.type = 'root';
			}
			
			return data;
		});
};

module.exports.search = async (node) => {
	return tm.search(node)
		.then(data => {
			let tree = {};
			if(data.length === 0) {
				return [];
			}
			
			data.forEach(item => {
				let path = item.name.split(conf.get('separator'));
				
				while(path.length > 0) {
					const parent = path.join(conf.get('separator'));
					
					if(!tree[parent]) {
						tree[parent] = { text: parent };
						
						if(item.name === parent) {
							tree[parent].size = item.size;
							tree[parent].opened = false;
							tree[parent].type = 'leaf';
						} else {
							tree[parent].type = 'folder';
						}
					}
					path.pop();
				}
				
			});

			tree = _.sortBy(tree, ['text']);
			tree[0].type = 'root';
			tree = tm.makeNestedTree(tree, 'text');

			return tree.shift();
		})
};