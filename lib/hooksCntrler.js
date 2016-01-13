var Spark = require('csco-spark'),
    Promise = require('bluebird'),
    helpers = require('./helpers');

const FILE_URI = 'http://45.55.244.195:8181/dlfile/';

module.exports = (() => {
  var sparkToken = require('../config').token;
  var spark = Spark({
    uri: 'https://api.ciscospark.com/v1',
    token: sparkToken
  });

  // Helper FNs
  var getMessage = (msgId) => {
    return spark.getMessage(msgId).then((res) => {
      return JSON.parse(res);
    })
  };

  var parseMsg = (msgContents) => {
    switch(msgContents.text) {
      case '/help':
        // Send Message back Listing Available SubCmds
        break;
      case '/cfggen':
        // Send MsgContents as an Array
        return spark.getFileUris([msgContents])
          .then((uris) => {
            return Promise.map(uris, (uri) => spark.dlFiles(uri));
          });
    }
  };

  var hooksCntrler = {};

  hooksCntrler.procHooks = (req, res) => {
    var roomId;
    var payload = req.body;
    roomId = payload.data.roomId;
    // Get the MSG ID from the payload
    getMessage(payload.data.id).then((data) => {
      return parseMsg(data);
    }).then((files) => {
      if(files instanceof Array) {
        //Convert Blobs
        var fileContents = files.map((file) =>
          file.blob.toString('utf8'));
        var nxusCfgs = require('nxus-cfger')(fileContents);
        // console.log(nxusCfgs);
        var fileData = [];
        // Write Contents to Disk to be Served to a Spark Room
        Promise.map(nxusCfgs, (nxusCfg, i) => {
          var fn = `nxus-cfg-${new Date().getTime()}.txt`;
          fileData.push({
            fn: fn,
            uri: FILE_URI + fn
          });
          return helpers.storeFile(fn, nxusCfg);
        }).then(() => {
          return Promise.map(fileData, (file) => {
            return spark.sendMessage({
              roomId: roomId,
              files: [file.uri]
            }).then((resp) => {
              var msg = resp;
              return helpers.rmFile(file.fn).then((bool) => {
                if(bool) msg.msg = 'file removed from server';
                return msg;
              });
            });
          }).then((msges) => {
            res.status(200).send(msges);
          });
        });
      }
    })

  };

  return hooksCntrler;
}());
