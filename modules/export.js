var settings = require('../settings');
var dbModules = require('./db');

exports.getList = function(req, res) {
  if (req.params.code === settings.code) {
    query = dbModules.queryDatabase("SELECT * FROM participants WHERE timestamp>'2020-02-01 12:00:00' order by id;")
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
