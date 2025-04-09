const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const { check_authentication } = require('./Utils/check_auth');
const fs = require('fs');

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const menusRouter = require('./routes/menus');
const rolesRouter = require('./routes/roles');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const servicesRouter = require('./routes/services');
const uploadRouter = require('./routes/upload');

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/Webbanxedap", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to Webbanxedap database'))
.catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('NNPTUD'));
app.use(express.static(path.join(__dirname, 'public')));

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Unrestricted Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

// Global Authentication Middleware
const excludedPaths = ['/auth', '/index', '/register', '/login'];
app.use((req, res, next) => {
  if (!excludedPaths.some(path => req.path.startsWith(path))) {
    check_authentication(req, res, next);
  } else {
    next();
  }
});

// Protected Routes
app.use('/users', usersRouter);
app.use('/menus', menusRouter);
app.use('/roles', rolesRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/reviews', reviewsRouter);
app.use('/services', servicesRouter);

// Error Handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    success: false,
    message: err.message
  });
});

module.exports = app;