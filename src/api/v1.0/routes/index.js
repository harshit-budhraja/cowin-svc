const express = require('express');
const routes = express.Router();

const sessionsRouter = require('./sessions')();
routes.use('/sessions', sessionsRouter);

module.exports = routes;