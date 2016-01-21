var morgan = require('morgan'),
    fs = require('fs');

module.exports = (app, express, authCntrler) => {
  var router = express.Router();

  var axxLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
  
  router.use(morgan('combined', {stream: axxLogStream}));
  router.post('/authenticate', authCntrler.authenticate);
  router.post('/access', authCntrler.access);
  router.post('/refresh', authCntrler.access);

  app.use(router);
};
