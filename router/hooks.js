var hooksCntrler = require('../lib/hooksCntrler');

module.exports = (app, express) => {
  var router = express.Router();
  router.post('/hooker', hooksCntrler.procHooks);
  app.use(router);
};
