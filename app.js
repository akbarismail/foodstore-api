const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const authRouter = require('./apps/auth/router');
const productRouter = require('./apps/products/router');
const categoryRouter = require('./apps/categories/router');
const tagRouter = require('./apps/tags/router');
const regionRouter = require('./apps/region/router');
const deliveryRouter = require('./apps/delivery-address/router');
const cartRouter = require('./apps/cart/router');
const orderRouter = require('./apps/order/router');
const invoiceRouter = require('./apps/invoice/router');
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

app.use(cors());
app.use(decodeToken());
app.use('/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', tagRouter);
app.use('/api', regionRouter);
app.use('/api', deliveryRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api', invoiceRouter);

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
