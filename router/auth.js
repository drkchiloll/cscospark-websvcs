module.exports = (app, express, authCntrler) => {
  var router = express.Router();

  router.post('/authenticate', authCntrler.authenticate);

  app.use(router);
};
