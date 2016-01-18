module.exports = (app, express, hooksCntrler) => {
  var router = express.Router();
  router.post('/hooker', hooksCntrler.procHooks);
  app.use(router);
};
