const conf = require('config');
const _ = require('lodash');
const tm = require('../models/TreeModel');

module.exports.getNodeChildren = (nodeName, includeRoot) => {
	return tm.getChildren(nodeName, includeRoot)
		.then(children => {
			children.map(item => {
				item.text = item.name;
				item.children = (item.size === 0) ? false : true;
				return item;
			});
			
			let data = children;

			if(includeRoot) {
				data = children.shift();
				data.state = { 'opened':true };
				data.children = children;
				data.type = 'folder';
			}
			
			return data;
		});
};

module.exports.search = async (node) => {
	return tm.search(node)
		.then(data => {
			if(data.length === 0)
				return [];
			let tree = {};
			
			data.forEach(item => {
				let path = item.name.split(conf.get('separator'));
				
				while(path.length > 0) {
					const parent = path.join(conf.get('separator'));
					
					if(!tree[parent]) {
						tree[parent] = { text: parent };
						
						if(item.name === parent) {
							tree[parent].size = item.size;
							tree[parent].opened = false;
						}
					}
					path.pop();
				}
				
			});

			tree = _.sortBy(tree, ['text']);
			tree = tm.makeNestedTree(tree, 'text');
			// let _root  = tree.shift();
			// console.log(tree);
			
			// return { text: _root.text, children: tree };
			return tree.shift();
		})
};