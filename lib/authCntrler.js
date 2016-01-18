module.exports = (Spark) => {
  var auth = {};
  // Create spark "instance" (no need to pass params)
  var spark = Spark({uri:'',token:''});

  auth.authenticate = (req, res) => {
    var authData = req.body;
    spark.authenticate(authData).then((tokens) => res.status(200).send(tokens));
  };
  return auth;
};
