var dbModules = require('./db');

exports.getList = function(res) {
  query = dbModules.queryDatabase("SELECT first_name, last_name FROM participants WHERE cancelled='false' AND timestamp>'2018-02-12 12:00:00' ORDER BY id;")
    .then(function (data) {
      res.render('list', { title: 'Deltagare', data: data });
    })
    .catch(function (error) {
      console.log("Database error: " + error);
      var err = new Error(error);
      res.status(500);
      res.render('error', { error: err });
    });
};
