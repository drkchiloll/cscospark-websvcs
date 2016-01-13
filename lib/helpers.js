var fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird');

const FILE_PATH = path.join(__dirname, '../files/');

exports.storeFile = (fn, blob) => {
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

exports.rmFile = (fn) => {
  return new Promise((resolve, reject) => {
    fs.unlink(FILE_PATH + fn, (err) => {
      if(err) resolve(false);
      else resolve(true);
    });
  });
};
