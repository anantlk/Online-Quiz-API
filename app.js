const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const logger=require('morgan');

var index = require('./routes/index');
var users = require('./routes/users');

const admin = require(path.join(__dirname, 'routes', 'admin'));
const User = require(path.join(__dirname, 'models', 'user-model'));
const Promise = require('bluebird');
const flash = require('connect-flash');
const session = require('express-session');
// const port = process.env.port || 3000;
const app = express();
/**
 * Module dependencies.
 */

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Use ES6 promise library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/witty', { useMongoClient: true })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));

// Setup middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const keys = ['keyboard', 'cat'];
app.use(session({
  secret: 'shhsecret',
  resave: true,
  saveUninitialized: false,
  keys: keys
 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// require('./config/passport')(passport);


// Setup routes
app.use('/api', index);
app.use('/api/user', users);
app.use('/api/admin',admin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error',{error:err.status});
});



module.exports = app;
