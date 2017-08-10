const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require('config');
const tree = require('./routes/tree');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
	console.log(req.method, req.url);
	console.log(req.headers);
	console.log(req.body);
	next(null);
});

app.use('/api/tree', tree);
require('./middleware/errorHandle')(app);

app.listen(3000, () => {
	console.log('Tree browser app listening on port 3000!');
});