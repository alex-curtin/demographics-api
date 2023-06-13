const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

const db = require('./db');
const routes = require('./routes');
const app = express();
const port = 8500;

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  const test = await db.query('SELECT * FROM products');
  const { rows } = test;
  res.json({rows})
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
