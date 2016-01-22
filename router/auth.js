var morgan = require('morgan'),
    fs = require('fs');

module.exports = (app, express, authCntrler) => {
  var router = express.Router();

  var axxLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

  morgan.token('user', (req) => {
    if(req.body.user) return req.body.user;
    else return;
  });
  
  router.use(morgan('[:date[clf]] :method :url :status :user-agent :user', {stream: axxLogStream}));
  router.post('/authenticate', authCntrler.authenticate);
  router.post('/access', authCntrler.access);
  router.post('/refresh', authCntrler.access);

  app.use(router);
};
