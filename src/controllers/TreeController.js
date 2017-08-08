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
			}
			
			return data;
		})

};