var ulFileCntrler = require('../lib/fileCntrler.js');

module.exports = (app, express) => {
  var router = express.Router();

  router.post('/fileuploader', ulFileCntrler.postFile);
  router.get('/dlfile/:filename', ulFileCntrler.hostFile);

  app.use(router);
};
