var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

var cntrler = require('./lib/cntrler.js');

var app = express();
app
  .use(bodyParser.json({limit: '1000mb'}))
  .use(bodyParser.urlencoded({extended: true}))
  .use(express.static('./files'));

app.post('/fileuploader', cntrler.postFile);
app.get('/dlfile/:fileName', (req, res) => {
  var fn = req.params.fileName;
  res.sendFile(path.join(__dirname, `./files/${fn}`));
});

app.listen(9000);
