var settings = require('../settings.json');
var dbModules = require('./db');

exports.getList = function(req, res) {
  if (req.params.code === settings.code) {
    query = dbModules.queryDatabase("SELECT * FROM participants;")
      .then(function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2));
      })
      .catch(function (error) {
        console.log("Database error: " + error);
        var err = new Error(error);
        res.status(500);
        res.render('error', { error: err });
      });
  } else {
    res.status(403).send('Wrong access code!');
  }
};
