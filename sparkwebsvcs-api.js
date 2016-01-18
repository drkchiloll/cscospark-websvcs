var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    Spark = require('csco-spark');

var fileCntrlerFactory = require('./lib/fileCntrler'),
    hooksCntrlerFactory = require('./lib/hooksCntrler'),
    authCntrlerFactory = require('./lib/authCntrler');

// Inject Spark Object into Each Factory
var fileCntrler = fileCntrlerFactory(Spark),
    hooksCntrler = hooksCntrlerFactory(Spark),
    authCntrler = authCntrlerFactory(Spark);

var app = express();

app
  .use(bodyParser.json({limit: '1000mb'}))
  .use(bodyParser.urlencoded({extended: true}))
  .use(express.static('./files'));

// Pass app and express to the uldl router
require('./router/uldl.js')(app, express, fileCntrler);
require('./router/hooks.js')(app, express, hooksCntrler);
require('./router/auth.js')(app, express, authCntrler);

app.listen(8181);
