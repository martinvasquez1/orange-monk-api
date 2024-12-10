if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createServer } = require('node:http');

const connectMongoDB = require('./config/mongo');
const { connectPostgres } = require('./config/postgres');
const setupSocketIo = require('./sockets/socketIo');

const indexRouter = require('./routes/index');
const sqlIndexRouter = require('./sqlRoutes/index');

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

connectMongoDB();
connectPostgres();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 40,
  message: "You have exceeded the request limit. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use('/api/v1', indexRouter);
app.use('/api-sql/v1', sqlIndexRouter);

const server = createServer(app);
//const port = process.env.SOCKET_PORT || 3001;
setupSocketIo(server, corsOptions);
//server.listen(port, () => console.log(`WS Listening on port ${port}`));

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
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = { server };
