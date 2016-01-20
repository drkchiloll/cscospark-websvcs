var morgan = require('morgan'),
    fs = require('fs');

module.exports = (app, express, authCntrler) => {
  var router = express.Router();

  var axxLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
  app.use(morgan('combined', {stream: axxLogStream}));
  router.post('/authenticate', authCntrler.authenticate);
  router.post('/refresh', authCntrler.refresh);

  app.use(router);
};
