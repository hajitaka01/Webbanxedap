var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
let cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Cấu hình CORS đầy đủ
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Kết nối MongoDB không sử dụng các tùy chọn đã lỗi thời
mongoose.connect("mongodb://127.0.0.1:27017/Webbanxedap")
  .then(() => {
    console.log('Connected to Webbanxedap database');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('NNPTUD'));
app.use(express.static(path.join(__dirname, 'public')));

// Định nghĩa routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/menus', require('./routes/menus'));
app.use('/roles', require('./routes/roles'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/orders', require('./routes/orders'));
app.use('/reviews', require('./routes/reviews'));
app.use('/services', require('./routes/services'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send({
    success: false,
    message: err.message
  });
});

module.exports = app;