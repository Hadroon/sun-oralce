var https = require('https');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

var testRoute = require('./backend/routes/test-route');

app = express();

// app.use((req, res, next) => {
//     console.log(req.header('x-forwarded-proto'));
//     if (req.header('x-forwarded-proto') !== 'https') {
//       res.redirect(`https://${req.header('host')}${req.url}`)
//     } else {
//       next();
//     }
//   });


app.use('/', testRoute);
app.use(serveStatic(__dirname + "/dist"));

var port = process.env.PORT || 8080;

app.listen(port);
console.log('server started '+ port);


// const express = require('express');
// const serveStatic = require("serve-static");
// const path = require('path');
// const https = require('https');

// var createError = require('http-errors');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// var history = require('connect-history-api-fallback');

// var indexRouter = require('./back/routes/indexRouter');
// var apiRouter = require('./back/routes/apiRouter');
// var adminRouter = require('./back/routes/adminRouter');

// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vue-henkel'

// mongoose.connect(mongoUri);


// var app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', indexRouter);
// app.use('/api/', apiRouter);
// app.use('/admin/', adminRouter);
// app.use(serveStatic(path.join(__dirname, 'dist')));
// app.use(history());
// app.use(serveStatic(path.join(__dirname, 'dist')));

// const port = process.env.PORT || 8080;
// app.listen(port);