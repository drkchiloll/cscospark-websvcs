var morgan = require('morgan'),
    fs = require('fs');

module.exports = (app, express, authCntrler) => {
  var router = express.Router();

  var axxLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

  router.post('/authenticate',morgan('combined', {stream: axxLogStream}), authCntrler.authenticate);

  app.use(router);
};
