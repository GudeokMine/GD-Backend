const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const verifyRouter = require('./routes/verify');
const ServerEndTimeRouter = require('./routes/ServerEndTime');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', verifyRouter);
app.use('/ServerEndTime', ServerEndTimeRouter);

module.exports = app;
