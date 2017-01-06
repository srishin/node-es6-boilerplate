import express from 'express';
import path from 'path';

// import favicon from 'serve-favicon';
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
import bodyParser from 'body-parser';
import models from './models';

const app = express();
// var mqConn = require('./mq');
// var userAgent = require('./middlewares/userAgent.js');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.disable('etag');
// app.set('json spaces', 4);

// app.use(require('prerender-node'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
// app.use(cookieParser());

app.all('/*', (req, res, next) => {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-access-token,X-Key');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed

// app.all('/api/*', [require('./middlewares/validateRequest')]);


// Routes
app.use('/api/v1', require('./api/v1/routes'));


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {},
    });
});

// mqConn.connect();
// var config = require('./config/database.json');

models.sequelize
    .sync()
    .then(() => {
        console.log('Tables Synced');
    }).catch((error) => {
        console.log('Tables not Created', error);
    });

module.exports = app;
