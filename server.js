var https = require('https');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

app = express();

app.use((req, res, next) => {
    console.log(req.header('x-forwarded-proto'));
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next();
    }
  });

app.use(serveStatic(__dirname + "/dist"));

var port = process.env.PORT || 8080;

app.listen(port);
console.log('server started '+ port);