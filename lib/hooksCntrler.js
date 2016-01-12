var Spark = require('csco-spark'),
    Promise = require('bluebird');

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
        console.log(nxusCfgs);
      }
    })

  };

  return hooksCntrler;
}());
