var request = require('request'),
    qs = require('querystring'),
    url = require('url'),
    cheerio = require('cheerio');

// Constants
const initLoginUrl = 'https://idbroker.webex.com/idb/UI/Login';
const authUrl = 'https://idbroker.webex.com/idb/oauth2/v1/authorize';
const axxUrl = 'https://api.ciscospark.com/v1/access_token';
const scopes = (
  `spark:memberships_write spark:memberships_read `+
  `spark:rooms_read spark:rooms_write `+
  `spark:messages_write spark:messages_read`
);

// Helper Functions
var _req = (options, callback) => {
  request(options, (err, res, body) => {
    if(err) return callback(err, null);
    if((''+res.statusCode).startsWith('4')) return callback(res.statusCode, null);
    if(res.headers.location) return callback(null, res.headers.location);
    callback(null, body);
  })
};

var loginQS = (args) => {
  var goToParams = {
    id: args.id,
    redirectUri: args.redirectUri,
  };
  return {
    IDToken0: '',
    IDToken1: args.user,
    IDToken2: args.pass,
    IDButton:'Sign+In',
    goto: goToUrl(goToParams),
    SunQueryParamsString: sunQuery({
      id: args.id, user: args.user, redirectUri: args.redirectUri
    }),
    encoded:'true',
    loginid: args.user,
    isAudioCaptcha: 'false',
    gx_charset: 'UTF-8'
  };
};

var sunQuery = (params) => {
  var goToParams = {
    id: params.id,
    redirectUri: params.redirectUri
  };
  return new Buffer(qs.stringify({
    isCookie: false,
    fromGlobal: 'yes',
    realm: 'consumer',
    type: 'login',
    encodedParamString: 'dHlwZT1sb2dpbg==',
    gotoUrl: goToUrl(goToParams),
    email: params.user
  })).toString('base64');
};

var goToUrl = (params) => (
  new Buffer(`${authUrl}?response_type=code&client_id=${params.id}`+
    `&redirect_uri=${encodeURIComponent(params.redirectUri)}`+
    `&scope=${encodeURIComponent(scopes)}`).toString('base64')
);

var authQS = (auth) => ({
  response_type: 'code',
  client_id: auth.id,
  redirect_uri: auth.redirectUri,
  service: 'webex-squared',
  scope: scopes
});

var authorizeForm = (auth) => ({
  security_code : auth.code,
  response_type: 'code',
  client_id: auth.id,
  decision: 'accept'
});

var accessTokenForm = (auth) => {
  var tok = {};
  tok = {
    grant_type: (auth.code) ? 'authorization_code' : 'refresh_token',
    client_id: auth.id,
    client_secret: auth.secret,
  };
  if(auth.code) {
    tok.code = auth.code;
    tok.redirect_uri = auth.redirectUri;
  } else {
    tok.refresh_token = auth.refreshToken;
  }
  return tok;
};

module.exports = (Spark) => {
  var auth = {};
  // Create spark "instance" (no need to pass params)
  var spark = Spark({uri:'',token:''});

  /**
   * @param {Object} req.body
   * @param {string} req.body.user - Username
   * @param {string} req.body.pass - Password
   * @param {string} req.body.id - client_id
   * @param {string} req.body.secret - client_secret
   * @param {string} req.body.redirectUri - redirect_uri
   */
  auth.authenticate = (req, res) => {
    var authData = req.body;
    var getLoginQS = loginQS({
      user: authData.user,
      pass: authData.pass,
      id: authData.id,
      redirectUri: authData.redirectUri
    });
    _req({
      uri: initLoginUrl,
      method: 'GET',
      qs: getLoginQS,
      jar: true
    }, (err, body) => {
      if(err) throw new Error('Auth Error on Login REQ');
      var $ = cheerio.load(body);
      var tmpCode;
      tmpCode = $('input[type="hidden"]')
        .attr('name', 'security_code')
        .val();
      var getAuthQS = authQS({
        id: authData.id,
        redirectUri: authData.redirectUri
      });
      var getAuthorizeForm = authorizeForm({
        code: tmpCode,
        id: authData.id
      });
      _req({
        uri: authUrl,
        method: 'POST',
        jar: true,
        qs: getAuthQS,
        form: getAuthorizeForm
      }, (err, uri) => {
        if(err) throw new Error('Auth Error in Authorize REQ');
        var code = url.parse(uri)
          .query
          .replace(/\S+=/i, '');
        var getAccessForm = accessTokenForm({
          id: authData.id,
          secret: authData.secret,
          redirectUri: authData.redirectUri,
          code: code
        });
        _req({
          uri: axxUrl,
          method: 'POST',
          form: getAccessForm
        }, (err, tokens) => {
          if(err) throw new Error('Auth Error: Access Token Not Issued');
          res.status(200).send(JSON.parse(tokens));
        })
      });
    });
  };

  /**
   * @param {Object} req.body
   * @param {String} id - client_id
   * @param {String} secret - client_secret
   * @param {String} code - authorization code
   * @param {String} refreshToken - refresh_token
   */
  auth.access = (req, res) => {
    var authData = req.body;
    _req({
      uri: axxUrl,
      method: 'POST',
      form: accessTokenForm(authData)
    }, (err, accessToken) => {
      res.status(200).send(JSON.parse(accessToken));
    })
  };

  return auth;
};
