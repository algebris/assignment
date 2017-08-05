const conf = require('config');
const util = require('util');
const argv = require('minimist')(process.argv.slice(2));
const db = require('./src/lib/db');

function boot () {
	const th = require('./src/TreeHelper');
	switch (argv._[0]) {
		case 'fetch':
			const param = argv._[1];
			return th.storeTree()
				.then(data => console.log(data));
			break;
		case 'tree':
			const nodeName = argv._[1];
			return th.getTree(nodeName)
				.then(data =>
					console.log(util.inspect(data, { depth: null }))
				);
			break;
		case 'server':
			//
		default:
			console.log('Usage: npm start [operation] [options]');
	}
}

db.connect(conf.get('db.url'))
	.then(() => console.log('Mongo connected to ' + conf.get('db.url')))
	.then(() => boot())
	.then(() => db.get().close())
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});