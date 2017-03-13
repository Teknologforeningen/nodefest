var express = require('express');
var register = require('../modules/register');
var list = require('../modules/list');
var listExport = require('../modules/export');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Teknologföreningens årsfest' });
});


/* GET register form */
router.get('/register/', function(req, res, next) {
  if (Date.now() < 1486425600000) {
    res.render('notopen', { title: 'Anmälningen är stängd' });
  } else if (Date.now() < 1490400000000) {
    res.render('register', { title: 'Anmälan' });
  } else {
    res.render('closed', { title: 'Anmälningen är stängd' });
  }
});


/* POST submit form */
router.post('/submit/', function(req, res, next) {
  if (register.sanitizeForm(req, res)) {
    register.saveParticipant(req, res);
  }
});


/* GET the participants' list */
router.get('/list/', function(req, res, next) {
  list.getList(res);
});


/* GET the participants' list as JSON */
router.get('/export/json/:code', function(req, res, next) {
  listExport.getList(req, res);  
});

module.exports = router;
