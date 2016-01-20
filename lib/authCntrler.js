module.exports = (Spark) => {
  var auth = {};
  // Create spark "instance" (no need to pass params)
  var spark = Spark({uri:'',token:''});

  auth.authenticate = (req, res) => {
    var authData = req.body;
    spark.authenticate(authData).then((tokens) => { 
      return res.status(200).send(tokens)
    }).catch((err) => {
      res.status(500).send('Unknown Server Error, Please Try Again');
    });
  };
  return auth;
};
