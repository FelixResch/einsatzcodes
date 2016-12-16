var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var loki = require('lokijs');
var data = new loki('codes.json', {autoload: true});


var index = require('./routes/index');
var codes = require('./routes/codes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if(process.env.NODE_ENV == 'production') {
    app.use((req, res, next) => {
        if(req.headers["x-forwarded-proto"] == 'http') {
            res.redirect('https://' + req.headers.host + req.path);
        } else {
            next();
        }
    });
}

app.use(function (req, res, next) {
    req.db = data;
    next()
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts/jquery', express.static(path.join(__dirname, 'bower_components/jquery/dist')));
app.use('/styles/fontawesome', express.static(path.join(__dirname, 'bower_components/font-awesome')));
app.use('/', index);
app.use('/codes', codes);

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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var dCodes = data.addCollection('codes');
dCodes.insert({
    code: {
        major: '17',
        priority: 'A',
        minor: '03'
    },
    lang: 'de-AT',
    description: '(Ab)Sturz - allgemeine Hilfe (keine Verletzung)'
});
dCodes.insert({
    code: {
        major: '17',
        priority: 'D',
        minor: '03'
    },
    lang: 'de-AT',
    description: '(Ab)Sturz - Bewußtseinstrübung'
});
var dSuffixes = data.addCollection('suffixes');
dSuffixes.insert({
    major: '17',
    suffix: 'B',
    lang: 'de-AT',
    suffixText: 'am Boden'
});
dSuffixes.insert({
    major: '17',
    suffix: 'S',
    lang: 'de-AT',
    suffixText: 'Suizid'
});

data.saveDatabase();

module.exports = app;
