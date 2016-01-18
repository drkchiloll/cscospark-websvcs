module.exports = (app, express, fileCntrler) => {
  var router = express.Router();

  router.post('/fileuploader', fileCntrler.postFile);
  router.get('/dlfile/:filename', fileCntrler.hostFile);

  app.use(router);
};
