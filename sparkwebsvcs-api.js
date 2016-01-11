var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

var app = express();

app
  .use(bodyParser.json({limit: '1000mb'}))
  .use(bodyParser.urlencoded({extended: true}))
  .use(express.static('./files'));

// Pass app and express to the uldl router
require('./router/uldl.js')(app, express);

app.listen(8181);
