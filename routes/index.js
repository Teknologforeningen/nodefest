var express = require('express');
var register = require('../modules/register');
var list = require('../modules/list');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Teknologföreningens årsfest' });
});


/* GET register form */
router.get('/register/', function(req, res, next) {
  res.render('register', { title: 'Anmälan' });
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


module.exports = router;
