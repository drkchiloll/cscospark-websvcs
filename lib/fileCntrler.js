var path = require('path'),
    fs = require('fs'),
    Promise = require('bluebird'),
    Spark = require('csco-spark');

// CONSTANTS
const FILE_PATH = path.join(__dirname, '../files/'),
      FILE_URI = 'http://45.55.244.195:8181/dlfile/';

module.exports = (() => {
  // Helper FNs
  var storeFile = (fn, blob) => {
    return new Promise((resolve, reject) => {
      //Check File Type
      var ft = path.extname(fn).replace('.','').toLowerCase();
      var encoding;
      switch(ft) {
        case 'png':
        case 'jpg':
        case 'zip':
          encoding = 'base64';
          break;
        default:
          encoding = null;
      }
      fs.writeFile(FILE_PATH+fn, blob, encoding, (err) => {
        // Figure out how we're going to handle Errors Later
        if(err) resolve(false);
        else resolve(true);
      })
    });
  };

  var rmFile = (fn) => {
    return new Promise((resolve, reject) => {
      fs.unlink(FILE_PATH + fn, (err) => {
        if(err) resolve(false);
        else resolve(true);
      });
    });
  };

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
      var payload = file.blob;
      fileData.push({fn: fn, uri: FILE_URI + fn});
      return storeFile(fn, payload);
    }).then((fns) => {
      // Upload Files/Messages into Spark Room (1 at a time)
      Promise.map(fileData, (file) => {
        spark.sendMessage({
          roomId: roomId,
          files: [file.uri]
        }).then((resp) => {
          var msg = resp;
          // Remove File from Directory
          rmFile(file.fn).then((bool) => {
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
