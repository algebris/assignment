const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require('config');
const errors = require('./lib/errors');
const {CustomError, ErrorModel} = require('./lib/error-model');
const tree = require('./routes/tree');
const os = require('os');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/tree', tree);

app.use((req, res, next) => {
	next(errors.endpointNotFoundError());
});

app.use((err, req, res, next) => {
	const error = err instanceof ErrorModel || err instanceof CustomError
		? err : errors.unknownError(err);
	
	console.error('Error message: ', error.message);

	if (error.originalMessage) console.error('Error original message: ', error.originalMessage);
	console.error('Error stacktrace: ', error.stack.split(os.EOL).slice(1).map(item => item.trim()).join(os.EOL));

	res.status(error.status).json(error);
});

app.listen(3000, () => {
	console.log('Tree browser app listening on port 3000!');
});