var Promise = require('bluebird'),
    path = require('path'),
    Spark = require('csco-spark'),
    helpers = require('./helpers');

// CONSTANTS
const FILE_URI = 'http://45.55.244.195:8181/dlfile/';

module.exports = (() => {
  var fileCntrler = {};

  fileCntrler.postFile = (req, res) => {
    var token = req.body.sparkToken;
    var roomId = req.body.sparkRoom;
    var spark = Spark({
      uri: 'https://api.ciscospark.com/v1',
      token: token
    });

    var files = req.body.data;
    var fileData = [];
    // Iterate Through the Data using Promises
    Promise.map(files, (file) => {
      var fn = file.fileName;
      var urlFN;
      var payload;
      switch(path.extname(fn)) {
        case '.png':
        case '.jpg':
        case '.zip':
        case '.docx':
        case '.pptx':
        case '.xlsx':
          payload = new Buffer(file.blob, 'base64');
          break;
        default:
          payload = file.blob;
      }
      if(fn.includes(' ')) urlFN = fn.replace(/\s/gi, '%20');
      fileData.push({fn: fn, uri: FILE_URI + urlFN});
      return helpers.storeFile(fn, payload);
    }).then((fns) => {
      // Upload Files/Messages into Spark Room (1 at a time)
      return Promise.map(fileData, (file) => {
        return spark.sendMessage({
          roomId: roomId,
          files: [file.uri]
        }).then((resp) => {
          var msg = resp;
          // Remove File from Directory
          return helpers.rmFile(file.fn).then((bool) => {
            if(bool) msg.msg = 'File Removed from Server';
            return msg;
          });
        })
      }).then((msges) => {
        res.status(200).json(msges);
      });
    });
  };

  fileCntrler.hostFile = (req, res) => {
    var fn = req.params.filename;
    var filePath = path.join(__dirname, `../files/${fn}`);
    res.sendFile(filePath);
  };

  return fileCntrler;
}());
