const express = require('express');
const router = express.Router();

const tc = require('../controllers/TreeController');

router.post('/node', (req, res, next) => {
	let includeRoot = false;
	let node = req.body.node;
	
	if (req.body.node === 'false') {
		node = null;
		includeRoot = true;
	}
	
	tc.getNodeChildren(node, includeRoot)
		.then(data => res.json(data))
		.catch(err => next(err));
});

router.post('/search', (req, res, next) => {
	let node = req.body.node;

	tc.search(node)
		.then(data => res.json(data))
		.catch(err => next(err));
});

module.exports = router;