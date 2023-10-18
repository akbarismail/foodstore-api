const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./apps/users/router');
const productRouter = require('./apps/products/router');
const categoryRouter = require('./apps/categories/router');
const tagRouter = require('./apps/tags/router');
const regionRouter = require('./apps/region/router');
const deliveryRouter = require('./apps/delivery-address/router');
const { decodeToken } = require('./apps/auth/middleware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(decodeToken());
app.use('/auth/v1', authRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', tagRouter);
app.use('/api/v1', regionRouter);
app.use('/api/v1', deliveryRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
