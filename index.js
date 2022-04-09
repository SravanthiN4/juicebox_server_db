// inside index.js
require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const {client, getUserById} = require('./db');

const { request } = require('express');



client.connect();
server.use(bodyParser.json())
server.use(morgan('dev'));
server.use(express.json());
server.use('/api',apiRouter);



server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});