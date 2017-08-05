const util = require('util');
const http = require('http');
const { URL } = require('url');
const _ = require('lodash');
const conf = require('config');
const cheerio = require('cheerio');

class HttpXmlReader {
	constructor() {
		this.url = new URL(conf.get('uri'));
		this.keepAliveAgent = new http.Agent({ keepAlive: true, maxSockets: conf.get('maxSockets')});
		this.options = {
			host: this.url.hostname,
			method: 'GET',
			agent: this.keepAliveAgent
		};
	}

	async request(nodeId) {
		const options = _.assignIn(
			{ path: util.format(this.url.pathname + this.url.search, nodeId) }, this.options
		); // todo: how to get path naturally?
		let response = '';
		
		return new Promise((resolve, reject) => {
			const req = http.request(options, res => {
				res.on('data', chunk => {
					response += chunk;
				});
				res.on('end', () => {
					const data = cheerio.load(response);
					resolve(data);
				});
			});
			req.on('error', (err) => reject(err));
			req.end();
		});
	}
}

module.exports = HttpXmlReader;