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
    var reply;

    switch(msgContents.text) {
      case '/help':
        // Send Message back Listing Available SubCmds
        break;
      case '/cfggen':
        // Get the FileURIs from the Contents
	// Send MsgContents as an Array
        return spark.getFileUris([msgContents])
          .then((uris) => {
	    console.log(uris);
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
      parseMsg(data).then((files) => {
        console.log(files[0].blob.toString('utf8'));
      })
    })
  };

  return hooksCntrler;
}());
